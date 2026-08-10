import { LogLevel } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import {
  LoggerTypeEnum,
  LOG_LEVEL_DEFAULT,
} from '@nestjs-yalc/logger/logger.enum';
import { envToArray } from '@nestjs-yalc/utils/env.helper';
import { IServiceConf } from '@boxedout-libs/shared/conf.type';
import { MigrationSelection } from '@nestjs-yalc/database/db-ops.service';

export interface ICliServiceConf extends IServiceConf {
  migrationPayload?: MigrationSelection;
}

export const ConfFactory = (): ICliServiceConf => {
  // comma separated list of logger levels from NEST_LOGGER_LEVELS env
  const logLevels: LogLevel[] = envToArray<LogLevel>('NEST_LOGGER_LEVELS');

  return {
    appName: 'cli',
    domain: process.env.DOMAIN || 'localhost',
    host: process.env.HOST || '0.0.0.0',
    port:
      (process.env.GATEWAY_PORT && parseInt(process.env.GATEWAY_PORT, 10)) ||
      60101,
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
    migrationPayload: process.env.CLI_MIGRATION_PAYLOAD
      ? JSON.parse(process.env.CLI_MIGRATION_PAYLOAD)
      : undefined,
  };
};

export const CLI_CONF_ALIAS = 'cliConf';

export const regConf = registerAs(CLI_CONF_ALIAS, ConfFactory);
