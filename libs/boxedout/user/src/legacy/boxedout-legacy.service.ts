import { DbConnection } from '@boxedout-libs/shared/db-default.conf';
import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { FastifyRequest } from 'fastify/types/request';
import { Connection } from 'typeorm';
import { UAParser } from 'ua-parser-js';
import {
  AccountDeletedError,
  BoxedOutLockedError,
  GeneralError,
  IncorrectPasswordError,
  IncorrectTokenError,
  InputValidationError,
  TokenAlreadyUsedError,
  TwoFactorNotEnabledError,
  TwoFactorRequiredError,
  UserLockedError,
  WithdrawalLockedError,
} from './common.error';
import {
  MAX_INVALIDATE_SESSION_ATTEMPTS,
  ValidationFilters,
} from './constants';
import { PubSubService } from '@boxedout-libs/redis';
import { countries } from 'country-data';
import { UserChangePasswordDto } from '@boxedout/user/dto/user-change-password.type';
import * as bcrypt from 'bcryptjs';
import {
  EmailChangedTemplate,
  EmailPriority,
  PasswordChangedTemplate,
  SignupInUseTemplate,
} from '@boxedout-libs/shared/emailSender/email-sender.def';
import { EmailSenderService } from '@boxedout-libs/shared/emailSender/email-sender.service';
import { UserChangeEmailDto } from '@boxedout/user/dto/user-change-email.type';
import { decryptString } from '@nestjs-yalc/aws-helpers';
import { getEncMode } from '@boxedout-libs/shared/helpers/aws.helper';
import { randomBytes } from 'crypto';
import { whitelist } from '@boxedout/user/legacy/validation.helper';
import { verifyToken } from '@boxedout-libs/shared/helpers/two-factor.helper';

@Injectable()
export class BoxedOutLegacyService {
  constructor(
    @InjectConnection(DbConnection.BOXEDOUT)
    private boxedoutConnection: Connection,
    @Inject('REDIS') private redis: PubSubService,
    private emailSenderService: EmailSenderService,
  ) {}

  async changeUserEmail(
    guid: string,
    request: FastifyRequest,
    body: UserChangeEmailDto,
  ) {
    await this.audienceAllowed(request, 'website');
    await this.permissions(guid, 'locked');
    await this.limitBruteForce(request);

    const user: { password: string; twoFactor: number; language: string } = (
      await this.boxedoutConnection.query(
        'SELECT password, twoFactor, language ' +
          ' FROM userList ' +
          ' WHERE guid = ?',
        [guid],
      )
    )[0];

    if (user.twoFactor === 1) {
      await this.twoFactor(guid, body.twoFactor || '');
    }
    if (!bcrypt.compareSync(body.password, user.password)) {
      throw new IncorrectPasswordError();
    }

    const currentEmail = (
      await this.query(
        'SELECT email ' +
          ' FROM userEmail ' +
          " WHERE guid = ? AND status = 'verified'",
        [guid],
      )
    )[0]?.email; // Is it correct to assume that the first verified is the current email?

    if (body.email === currentEmail) {
      throw new InputValidationError('same_email');
    }

    // Request is validated, so let's update
    const emailTokenOld = randomBytes(20).toString('hex');
    const emailTokenNew = randomBytes(20).toString('hex');

    await this.query(
      'UPDATE boxedout.changeRequest ' +
        ' SET valid = 0 ' +
        " WHERE guid = ? AND type = 'email'",
      [guid],
    );

    const emailQuery: [{ guid: string }] = await this.query(
      'SELECT userList.guid AS guid, email, language, firstName, lastName' +
        ' FROM userEmail JOIN userList ON userEmail.guid = userList.guid' +
        ' WHERE email = ?',
      [body.email],
    );

    if (emailQuery.length >= 1) {
      const emailResult = emailQuery[0];

      await this.emailSenderService.sendEmail(
        currentEmail,
        new EmailChangedTemplate({
          language: user.language,
          confirm: emailTokenOld,
          from: currentEmail,
          to: body.email,
          ip: this.ip(request),
        }),
        EmailPriority.HIGH,
      );
      await this.emailSenderService.sendEmail(
        emailResult.guid,
        new SignupInUseTemplate(),
        EmailPriority.HIGH,
      );
    } else {
      await this.emailSenderService.sendEmail(
        currentEmail,
        new EmailChangedTemplate({
          language: user.language,
          confirm: emailTokenOld,
          from: currentEmail,
          to: body.email,
          ip: this.ip(request),
        }),
        EmailPriority.HIGH,
      );

      await this.emailSenderService.sendEmail(
        body.email,
        new EmailChangedTemplate({
          language: user.language,
          confirm: emailTokenNew,
          from: currentEmail,
          to: body.email,
          ip: this.ip(request),
        }),
        EmailPriority.HIGH,
      );
    }
    await this.query(
      "INSERT INTO changeRequest SET guid = ?, type = 'email', changeFrom = ?, changeTo = ?, fromToken = ?, toToken = ?, ip = ?, userAgent = ?, valid = 1",
      [
        guid,
        currentEmail,
        body.email,
        emailTokenOld,
        emailTokenNew,
        this.ip(request),
        this.userAgent(request),
      ],
    );
    await this.userLog(request, 'email_change', {
      data: { email: body.email },
    });
  }

  async changeUserPassword(
    guid: string,
    request: FastifyRequest,
    body: UserChangePasswordDto,
  ) {
    await this.audienceAllowed(request, 'website');
    await this.permissions(guid, 'locked');
    await this.limitBruteForce(request);

    const user: { password: string } = (
      await this.query(
        'SELECT password FROM userEmail JOIN userList ON userEmail.guid = userList.guid WHERE userList.guid = ?',
        [guid],
      )
    )[0];

    if (!bcrypt.compareSync(body.password_current, user.password)) {
      throw new IncorrectPasswordError('current_password_incorrect');
    }

    const sessionId = this.getSessionIdFromAuth(request);

    const bcryptPassword = await bcrypt.hash(
      body.password_new1,
      await bcrypt.genSalt(11),
    );

    await this.query('UPDATE userList SET password = ? WHERE guid = ?', [
      bcryptPassword,
      guid,
    ]);

    await this.userLog(request, 'password_changed', {
      guid: guid,
    });

    await this.emailSenderService.sendEmail(
      guid,
      new PasswordChangedTemplate({
        userAgent: this.humanUserAgent(request),
        ip: this.ip(request),
        country: this.country(request),
      }),
      EmailPriority.HIGH,
    );

    await this.invalidateSessions({
      guid: guid,
      notSession: sessionId,
    });

    await this.query(
      'UPDATE boxedout.resetRequest SET valid = 0 WHERE guid = ?',
      [guid],
    );

    await this.query(
      'UPDATE boxedout.changeRequest SET valid = 0 WHERE guid = ?',
      [guid],
    );
  }

  private async twoFactor(guid: string, twoFactorToken: string) {
    // Validates if the token is empty
    if (!twoFactorToken) {
      throw new TwoFactorRequiredError();
    }

    const user: { twoFactorKey: string; twoFactorLatest: string } = (
      await this.query(
        'SELECT twoFactorKey, twoFactorLatest FROM userList WHERE guid = ?',
        [guid],
      )
    )[0];

    if (!user.twoFactorKey) {
      throw new TwoFactorNotEnabledError();
    }

    const decryptedTwoFactorKey = await decryptString(
      user.twoFactorKey,
      getEncMode(),
    );

    if (!verifyToken(decryptedTwoFactorKey, twoFactorToken)) {
      throw new IncorrectTokenError();
    }
    if (twoFactorToken === user.twoFactorLatest) {
      throw new TokenAlreadyUsedError();
    }

    await this.query(
      "UPDATE boxedout.resetRequest SET valid = 0 WHERE guid = ? AND type = 'two_factor'",
      [guid],
    );
    await this.query('UPDATE userList SET twoFactorLatest = ? WHERE guid = ?', [
      twoFactorToken,
      guid,
    ]);
    return 'ok';
  }

  private async query(sqlQuery: string, params?: any[]) {
    try {
      return await this.boxedoutConnection.query(sqlQuery, params);
    } catch (error: any) {
      throw error;
    }
  }

  private async audienceAllowed(
    request: any,
    audienceAllowed: string | string[],
  ) {
    // Audience describes for who the page is meant
    // 'open' for public pages
    // 'website', 'mobile', 'api', or combination ['website', 'mobile'] otherwise

    const isArray = Array.isArray(audienceAllowed);

    if (typeof audienceAllowed !== 'string' && isArray === false) {
      throw new GeneralError();
    }

    if (audienceAllowed === 'open') {
      return true; // Allow access to anyone
    }

    const userAudience = request.user.aud;

    if (isArray) {
      if (audienceAllowed.indexOf(userAudience) !== -1) {
        return true;
      }
    } else {
      if (audienceAllowed === userAudience) {
        return true;
      }
    }
    throw new GeneralError();
  }

  private country(request: any) {
    return countries[request.headers['CloudFront-Viewer-Country']]?.name ?? '';
  }

  private async permissions(guid: string, access = 'open') {
    if (['open', 'locked', 'withdrawal'].indexOf(access) === -1) {
      throw new GeneralError();
    }
    if (access !== 'open') {
      const result = await this.query(
        'SELECT boxedoutLock, userLock, withdrawalLock, accountDeleted FROM userList WHERE guid = ?',
        [guid],
      );
      if (result.length === 0 || result[0].accountDeleted === 1) {
        throw new AccountDeletedError();
      }
      const user = result[0];
      if (new Date(user.boxedoutLock).getTime() > Date.now()) {
        throw new BoxedOutLockedError();
      }
      if (new Date(user.userLock).getTime() > Date.now()) {
        throw new UserLockedError();
      }
      if (
        new Date(user.withdrawalLock).getTime() > Date.now() &&
        access === 'withdrawal'
      ) {
        throw new WithdrawalLockedError();
      }
    }
    return true;
  }

  private async invalidateSessions(sessionsToInvalidate: any) {
    // Allowed values:
    // object with guid: on resets
    // object with session: logout
    // object with guid/device: device deletion
    // object with guid/notSession: change password, increase security

    const expireSession = async (xx: any, sessionId: any) => {
      await this.query('DELETE FROM activeSessions WHERE xx = ?', [xx]);
      (this.redis.getPub() as any).publish('ExpiredSession', sessionId);
    };
    if (
      typeof sessionsToInvalidate.guid !== 'undefined' &&
      typeof sessionsToInvalidate.device !== 'undefined'
    ) {
      // device deletion
      for (const sessionToInvalidate of await this.query(
        'SELECT * FROM activeSessions WHERE guid = ? AND device = ?',
        [sessionsToInvalidate.guid, sessionsToInvalidate.device],
      )) {
        await expireSession(
          sessionToInvalidate.xx,
          sessionToInvalidate.sessionId,
        );
      }
    } else if (
      typeof sessionsToInvalidate.guid !== 'undefined' &&
      typeof sessionsToInvalidate.notSession !== 'undefined'
    ) {
      // change password, increase security
      for (const sessionToInvalidate of await this.query(
        'SELECT * FROM activeSessions WHERE guid = ? AND sessionId != ?',
        [sessionsToInvalidate.guid, sessionsToInvalidate.notSession],
      )) {
        await expireSession(
          sessionToInvalidate.xx,
          sessionToInvalidate.sessionId,
        );
      }
    } else if (typeof sessionsToInvalidate.guid !== 'undefined') {
      // resets
      for (const sessionToInvalidate of await this.query(
        'SELECT * FROM activeSessions WHERE guid = ?',
        [sessionsToInvalidate.guid],
      )) {
        await expireSession(
          sessionToInvalidate.xx,
          sessionToInvalidate.sessionId,
        );
      }
    } else if (typeof sessionsToInvalidate.session !== 'undefined') {
      // logout
      for (const sessionToInvalidate of await this.query(
        'SELECT * FROM activeSessions WHERE sessionId = ?',
        [sessionsToInvalidate.session],
      )) {
        await expireSession(
          sessionToInvalidate.xx,
          sessionToInvalidate.sessionId,
        );
      }
    } else {
      throw new GeneralError();
    }
  }

  private ip(request: FastifyRequest) {
    const ips = (request.headers['X-Forwarded-For'] as string)?.split(', ') || [
      request.ip,
    ];
    let index = ips.length - 1 - 2; // -1 for length/index and -2 because last IPs are added by API gateway | CloudFront
    index = index < 0 ? 0 : index;
    return whitelist(ips[index], ValidationFilters.ALL);
  }

  private userAgent(request: FastifyRequest): string {
    const agent = request.headers['user-agent'] as string;
    if (agent === null) {
      return '';
    }
    return agent;
  }

  private humanUserAgent(request: FastifyRequest) {
    const parsed = new UAParser(this.userAgent(request)).getResult();
    if (parsed.browser.name !== undefined && parsed.os.name !== undefined) {
      return parsed.browser.name + ' (' + parsed.os.name + ')';
    } else {
      try {
        // Try to split and find iOS or Android
        const mobileOS = this.userAgent(request).split(':')[0];
        if (['iOS', 'Android'].includes(mobileOS)) {
          return mobileOS;
        }
      } catch (error) {
        // Maybe we should do something with this error or improve validation
      }

      return '';
    }
  }

  private device(request: FastifyRequest) {
    const parsed = new UAParser(this.userAgent(request)).getResult();
    return parsed.device.type ?? '';
  }

  // Store user logs
  private async userLog(
    request: FastifyRequest,
    type: any,
    options: { guid?: string; data?: any },
  ) {
    await this.query(
      'INSERT INTO userLogs(guid,type,ip,userAgent,device,data) VALUES (?,?,?,?,?,?)',
      [
        options.guid ?? '',
        type,
        this.ip(request),
        this.userAgent(request),
        this.device(request),
        options.data ? JSON.stringify(options.data) : '',
      ],
    );
    return true;
  }

  private async limitBruteForce(request: FastifyRequest) {
    const sessionId = this.getSessionIdFromAuth(request);
    const update = await this.query(
      'UPDATE boxedout.activeSessions SET bruteForceCount = bruteForceCount + 1 WHERE sessionId = ? AND bruteForceCount < ?',
      [sessionId, MAX_INVALIDATE_SESSION_ATTEMPTS],
    );
    if (update.changedRows !== 1) {
      await this.invalidateSessions({ session: sessionId });
      throw new GeneralError();
    }
  }

  private getSessionIdFromAuth(request: FastifyRequest) {
    return (request as any).user.id;
  }

  async guid(request: any) {
    return (
      await this.query(
        'SELECT guid FROM boxedout.activeSessions WHERE sessionId = ?',
        [this.getSessionIdFromAuth(request)],
      )
    )[0]['guid'] as string;
  }
}
