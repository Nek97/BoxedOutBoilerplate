// @ts-nocheck
import { LogLevel } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import {
  LoggerTypeEnum,
  LOG_LEVEL_DEFAULT,
} from '@nestjs-yalc/logger/logger.enum';
import { envIsTrue, envToArray } from '@nestjs-yalc/utils/env.helper';
import { IServiceConf } from '@boxedout-libs/shared/conf.type';
import { IRedisConf } from '@boxedout-libs/redis';
import { APP_ALIAS_MANAGE_PANEL } from '..';

import { MANAGE_USER_COMPENSATE_LOGGER_CONTEXT } from '@boxedout/manage-user/user.def';
import { MANAGE_MONITOR_REFUND_LOGGER_CONTEXT } from '@boxedout/manage-monitor/monitor.def';
import { IAuth0Config } from '@boxedout/auth/auth.type';

export interface ManagePanelConf extends IServiceConf {
  redisConfig: IRedisConf;
  auth0Config?: IAuth0Config;
}

export const getEnvLoggerLevels = (
  context: string,
  def: LogLevel[],
): LogLevel[] => {
  const levels = envToArray<LogLevel>(
    `NEST_LOGGER_LEVELS_${context.toUpperCase()}`,
  );
  return levels.length ? levels : def;
};

export const ConfFactory = (): ManagePanelConf => {
  // comma separated list of logger levels from NEST_LOGGER_LEVELS env
  const logLevelsFromEnv: LogLevel[] =
    envToArray<LogLevel>('NEST_LOGGER_LEVELS');

  const logLevels: LogLevel[] = logLevelsFromEnv.length
    ? logLevelsFromEnv
    : LOG_LEVEL_DEFAULT;

  return {
    appName: APP_ALIAS_MANAGE_PANEL,
    domain: process.env.DOMAIN || 'localhost',
    host: process.env.HOST || '0.0.0.0',
    port:
      (process.env.MANAGE_PANEL_PORT &&
        parseInt(process.env.MANAGE_PANEL_PORT, 10)) ||
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
    logLevels,
    logContextLevels: {
      [MANAGE_USER_COMPENSATE_LOGGER_CONTEXT]: getEnvLoggerLevels(
        MANAGE_USER_COMPENSATE_LOGGER_CONTEXT,
        logLevels,
      ),
      [MANAGE_MONITOR_REFUND_LOGGER_CONTEXT]: getEnvLoggerLevels(
        MANAGE_MONITOR_REFUND_LOGGER_CONTEXT,
        logLevels,
      ),
    },
    redisConfig: {
      enabled: envIsTrue(process.env.REDIS_ENABLED),
      host: process.env.REDIS_HOST || 'redis',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
    // usare env per sentryCOnf
    sentryModuleConf: {
      sentryOptions: {
        environment: process.env.STAGE,
        dsn: process.env.SENTRY_DSN,
        release: process.env.SENTRY_RELEASE,
      },
    },
    emailSenderConfig: {
      awsConfig: {
        sqsEndpoint: process.env.SQS_ENDPOINT || '',
        sqsRegion: process.env.SQS_REGION || '',
      },
    },
    auth0Config: {
      audience: process.env.AUTH0_AUDIENCE || '',
      issuer: process.env.AUTH0_ISSUER || '',
      jwksUri: process.env.AUTH0_JWKS_URI || '',
    },
  };
};

export const MANAGE_CONF_ALIAS = 'manageConf';

export const regConf = registerAs(MANAGE_CONF_ALIAS, ConfFactory);
