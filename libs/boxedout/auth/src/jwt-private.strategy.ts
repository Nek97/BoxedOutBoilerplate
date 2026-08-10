import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '@boxedout-libs/db-boxedoutAdmin/entities/role.entity';
import type { IAuthModuleOptions } from './auth.type';
import { FastifyRequest } from 'fastify';

export interface IJwtOptions {
  ignoreExpiration?: boolean;
}

export interface IUserPayload {
  sessionId: string;
  userId: string;
  aud: AudienceEnum;
  ip: string;
  roles?: Role[];
}
export interface IUserRequest extends FastifyRequest {
  user: IUserPayload;
}
export interface IJwtPayload {
  id: string;
  aud: string;
  iss: string;
}

export enum AudienceEnum {
  WEBSITE = 'website',
  MOBILE = 'mobile',
}

@Injectable()
export class JwtPrivateStrategy extends PassportStrategy(
  Strategy,
  'PrivateJwt',
) {
  constructor(
    private readonly authService: AuthService,
    @Inject('CONFIG_OPTIONS') options: IAuthModuleOptions,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: options.jwtSecretPrivate,
      ignoreExpiration: options.ignoreJwtExpiration,
    });
  }

  validate(payload: any): IUserPayload {
    return this.authService.validatePrivatePayload(payload);
  }
}
