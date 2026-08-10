import { LogLevel } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import {
  LoggerTypeEnum,
  LOG_LEVEL_DEFAULT,
} from '@nestjs-yalc/logger/logger.enum';
import { envIsTrue, envToArray } from '@nestjs-yalc/utils/env.helper';
import { IServiceConf } from '@boxedout-libs/shared/conf.type';
import { APP_ALIAS_AUTH_PROVIDER } from '..';
import { IRedisConf } from '@boxedout-libs/redis';
import { IAuth0Config } from '@boxedout/auth/auth.type';

export interface UserProviderConf extends IServiceConf {
  redisConfig: IRedisConf;
  auth0Config?: IAuth0Config;
  identityManagerURL: string;
}

export const ConfFactory = (): UserProviderConf => {
  // comma separated list of logger levels from NEST_LOGGER_LEVELS env
  const logLevels: LogLevel[] = envToArray<LogLevel>('NEST_LOGGER_LEVELS');

  return {
    appName: APP_ALIAS_AUTH_PROVIDER,
    domain: process.env.DOMAIN || 'localhost',
    host: process.env.HOST || '0.0.0.0',
    port:
      (process.env.AUTH_PROVIDER_PORT &&
        parseInt(process.env.AUTH_PROVIDER_PORT, 10)) ||
      3000,
    isDev: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',
    isPipeline: process.env.NODE_ENV === 'pipeline',
    isProduction: process.env.NODE_ENV === 'production',
    env: process.env.NODE_ENV,
    apiPrefix: process.env.API_PREFIX || '',
    basePath: process.env.BASE_PATH || '',
    operationPrefix: '',
    jwtIssuer: process.env.JWT_ISSUER || process.env.DOMAIN || 'localhost',
    jwtSecretPrivate: process.env.JWT_SECRET_PVT || '',
    jwtSecretPublic: process.env.JWT_SECRET_PUB || '',
    jwtSecretMobile: process.env.JWT_SECRET_MOB || '',
    loggerType: process.env.NEST_LOGGER || LoggerTypeEnum.NEST,
    logLevels: logLevels.length ? logLevels : LOG_LEVEL_DEFAULT,
    redisConfig: {
      enabled: envIsTrue(process.env.REDIS_ENABLED),
      host: process.env.REDIS_HOST || 'redis',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
    auth0Config: {
      audience: process.env.AUTH0_AUDIENCE || '',
      issuer: process.env.AUTH0_ISSUER || '',
      jwksUri: process.env.AUTH0_JWKS_URI || '',
    },
    identityManagerURL: process.env.IDENTITY_MANAGER_URL || '',
  };
};

export const AUTH_CONF_ALIAS = 'authConf';

export const regConf = registerAs(AUTH_CONF_ALIAS, ConfFactory);
