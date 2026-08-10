// @ts-nocheck
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { User } from '@boxedout-libs/db-boxedout/entities/user.entity';
import { UserService } from '@boxedout/manage-user/user.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { AuthEvents } from './auth-events.enum';
import {
  AudienceEnum,
  IJwtPayload,
  IUserPayload,
  IUserRequest,
} from './jwt-private.strategy';
import * as crypto from 'crypto';
import { IAuthModuleOptions } from './auth.type';
import { FastifyRequest } from 'fastify';
import { UserEmailService } from '@boxedout/manage-user/user-email.service';
import { LoginError, UnauthorizedError } from '@boxedout-libs/errors';
class AllowedIpService { async validateIp() { return true; } async getEntity() { return {}; } }
import { ExtractJwt } from 'passport-jwt';
import * as jwtwebtoken from 'jsonwebtoken';
import { convertCookies } from '@boxedout-libs/shared/request.helper';

export interface ILoginPayload {
  Authorization: string;
  csrf: string;
}

/**
 * Number of current infra. layers in front of this application in the remote environments.
 * Cloudfront => API Gateway => NodeJS Lambda App => API Gateway
 */
const CURRENT_INFRASTRUCTURE_LAYERS = 4;

const JWT_MAX_LIFETIME_IN_MS = 86400000; // 24 * 3600 * 1000

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userEmailService: UserEmailService,
    private allowedIpService: AllowedIpService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    @Inject('CONFIG_OPTIONS') private options: IAuthModuleOptions,
  ) {}

  getOptions(): IAuthModuleOptions {
    return this.options;
  }

  isProdOrTestEnv() {
    return this.options.isProduction || this.options.isTest;
  }

  async checkAllowedIp(ip: string) {
    if (this.isProdOrTestEnv()) {
      if (this.options.isTest && ip === '') return;

      const allowedIp = await this.allowedIpService.getEntity({ ip });
      if (!allowedIp) {
        throw new LoginError('Ip not allowed');
      }
    }
  }

  async checkTwoFactor(guid: string) {
    if (this.isProdOrTestEnv()) {
      const userFromPayload = await this.userService.getEntity({
        guid,
      });

      if (!userFromPayload || userFromPayload.twoFactor !== 1) {
        throw new LoginError('Two factor not enabled');
      }
    }
  }

  createPrivateJwt = (payload: IJwtPayload | IUserPayload) =>
    this.jwtService.sign(payload, {
      secret: this.options.jwtSecretPrivate,
    });

  isValidPrivateJwt = (token: string): boolean => {
    if (!this.options.jwtSecretPrivate) return false;

    let verified;
    jwtwebtoken.verify(
      token,
      this.options.jwtSecretPrivate,
      (error, decoded) => {
        if (!error) {
          verified = decoded;
        }
      },
    );

    if (!verified) return false;

    return !!this.validatePrivatePayload(verified);
  };

  getJwtFromRequest = (req: any) => {
    return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  };

  createPublicJwt = (payload: IJwtPayload | IUserPayload) =>
    this.jwtService.sign(payload, {
      secret: this.options.jwtSecretPublic,
    });

  async validateUser(username: string, pass: string): Promise<Partial<User>> {
    const email = await this.userEmailService.getUserEmail(username);

    if (email?.User) {
      if (bcrypt.compareSync(pass, email.User.password)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = email.User;
        return result;
      }

      throw new LoginError('Invalid Password');
    }
    bcrypt.compareSync(
      'a',
      '$2a$11$ylGoS7RLtT2eW241ST72u.OW.Lxb8g8fUGW3YScMVbD03ejr7inZK',
    ); // To prevent timing leaking email ('test' with 11 rounds)
    throw new LoginError('Not existing user email');
  }

  async login(
    username: string,
    password: string,
    aud: AudienceEnum,
    iss: string,
    ip: string,
    addPrefix?: boolean,
  ): Promise<ILoginPayload> {
    await this.checkAllowedIp(ip);
    const user = await this.validateUser(username, password);
    if (!user.guid) throw new LoginError('Not existing user');
    await this.checkTwoFactor(user.guid);

    const sessionId = uuid();
    this.eventEmitter.emitAsync(AuthEvents.AFTER_USER_VALIDATION, user);
    const csrf = crypto.randomBytes(40).toString('hex');
    if (
      !(await this.userService.createActiveSession(
        user.guid,
        sessionId,
        aud,
        // @todo This should get the field `token` from the `userDevice` table
        'device',
        csrf,
        ip,
      ))
    ) {
      throw new LoginError('Session not created');
    }
    const payload: IJwtPayload = { id: sessionId, aud, iss };
    return {
      Authorization: `${addPrefix ? 'Bearer ' : ''}${this.createPublicJwt(
        payload,
      )}`,
      csrf,
    };
  }

  /**
   * Re-news a JWT token for the passed User
   * @param user
   * @param iss
   * @returns
   */
  async renewJwtTokenForUser(
    user: IUserPayload,
  ): Promise<ILoginPayload | undefined> {
    const iss = this.options.jwtIssuer || 'localhost';

    const activeSession = await this.userService.getActiveSession(
      user.sessionId,
    );

    // if there's not an active session, then the JWT can't be renewed
    if (!activeSession) {
      return;
    }

    const payload: IJwtPayload = {
      id: activeSession.sessionId,
      aud: user.aud,
      iss,
    };
    return {
      Authorization: this.createPublicJwt(payload),
      csrf: activeSession.csrf,
    };
  }

  /**
   *  Get the initial ip from the request headers
   *
   * @param req - the current request
   * @returns the original ip of the client
   */
  getIpFromRequest(req: FastifyRequest): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      const ips: string[] = Array.isArray(forwarded)
        ? forwarded
        : forwarded.split(',');

      /**
       * The `x-Forwarded-for` header contains the IPs of all the layers the request has gone through + the client sent IP(s).
       * We need to pick the IP before of the infrastructure layers.
       * To guarantee that the IP is the real user IP and not a forged one.
       * @url https://stackoverflow.com/questions/51393782/how-to-get-client-ip-of-requests-via-cloudfront
       */
      let index: number = ips.length - 1 - CURRENT_INFRASTRUCTURE_LAYERS; // -1 for length/index
      index = index < 0 ? 0 : index;
      return ips[index].trim();
    }

    if (this.options.allowLocalhost) {
      return '127.0.0.1';
    }

    return '';
  }

  /**
   *  Get the csrf token from the request headers
   *
   * @param req - the current request
   * @returns x-csrf-token
   */
  getCsrfFromRequest(req: FastifyRequest) {
    for (const header in req.headers) {
      if (header.toLowerCase() === 'x-csrf-token') {
        return req.headers[header];
      }
    }
    return '';
  }

  /**
   *  Invalidate the session deleting it
   *
   * @param sessionId - the sessionId
   * @returns true if the session in correctly invalidate
   */
  async invalidateSession(sessionId: string): Promise<boolean> {
    await this.userService.deleteActiveSession(sessionId); //invalidate the session
    return true;
  }

  /**
   *  Validates the current Request
   *
   * @param req - the current request
   * @returns true if the ip, audience of the request are the same of the login ip, audience
   * @returns false if the token is not found or invalid, or if the session is invalidated by ip or audience
   */
  async validateRequest(
    req: IUserRequest,
    user: IUserPayload,
  ): Promise<boolean> {
    const csrf = this.getCsrfFromRequest(req);

    if (!user || !user.sessionId) {
      return false;
    }
    const ip: string = this.getIpFromRequest(req);
    const sessionData = await this.userService.getActiveSession(user.sessionId);

    if (!sessionData) return false; //If we not found the session data

    // Compare the Request with the Session
    switch (true) {
      case sessionData.ip !== ip:
      case sessionData.audience !== user.aud:
      case sessionData.csrf !== csrf && this.options.isProduction === true:
      case new Date(sessionData.timestamp).getTime() + JWT_MAX_LIFETIME_IN_MS <
        Date.now():
        // Return the opposite of invalidateSession, to not validate the session
        return !this.invalidateSession(user.sessionId);
    }

    //If we cannot invalidate it pass the check
    return true;
  }

  /**
   *  Validate the request trough the ip verification and the presence of the jwt
   *
   * @param payload - the current request
   * @returns the user payload with the addition of the field userId
   * @throws UnauthorizedException if the issuer is not valid
   */
  async validatePayload(payload: any): Promise<IUserPayload> {
    const validIss = this.options.jwtIssuer || 'localhost';
    const sessionId: string = payload.id;
    if (validIss !== payload.iss) {
      if (sessionId) this.userService.deleteActiveSession(sessionId);
      throw new UnauthorizedError('Invalid iss');
    }
    const sessionData = await this.userService.getActiveSession(sessionId);
    if (!sessionData) {
      throw new UnauthorizedError('No session data');
    }
    return {
      sessionId,
      userId: sessionData.guid,
      aud: payload.aud,
      ip: payload.ip,
    };
  }

  /**
   *  Validate the request trough private jwt
   *
   * @param payload - the current request
   * @returns the user payload
   * @throws UNAUTHORIZED if is not valid
   */
  validatePrivatePayload(payload: IUserPayload): IUserPayload {
    if (payload.userId === undefined) {
      throw new UnauthorizedError('Invalid private payload');
    }

    return payload;
  }

  /**
   *  Retrieves the User inside the AuthService
   *
   * @param userId the user identity id
   * @param fields the list of fields to be returned
   * @returns the values of the fields passed as argument in an user entity format
   */
  getUserInfo(userId: string, fields: (keyof User)[]): Promise<User> {
    return this.userService.getEntityOrFail({ guid: userId }, fields);
  }
}

/**
 *  Get the cookies as object from the request headers
 *
 * @param req - the current request
 * @returns cookies formatted as an object
 */
export function getCookiesFromRequest(req: FastifyRequest) {
  return convertCookies(req?.headers?.cookie);
}
