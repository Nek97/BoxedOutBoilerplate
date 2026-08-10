import { LogLevel } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { LoggerTypeEnum } from '@nestjs-yalc/logger/logger.enum';
import { LOG_LEVEL_DEFAULT } from '@nestjs-yalc/logger/logger.enum';
import { envIsTrue, envToArray } from '@nestjs-yalc/utils/env.helper';
import { IServiceConfKafka } from '@boxedout-libs/shared/conf.type';
import { APP_ALIAS_KAKFA_APP } from '..';

export const ConfFactory = (): IServiceConfKafka => {
  // comma separated list of logger levels from NEST_LOGGER_LEVELS env
  const logLevels: LogLevel[] = envToArray<LogLevel>('NEST_LOGGER_LEVELS');

  return {
    appName: APP_ALIAS_KAKFA_APP,
    domain: process.env.DOMAIN || 'localhost',
    host: process.env.HOST || '0.0.0.0',
    port: 3005,
    isDev: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',
    isPipeline: process.env.NODE_ENV === 'pipeline',
    isProduction: process.env.NODE_ENV === 'production',
    env: process.env.NODE_ENV,
    apiPrefix: process.env.API_PREFIX || '',
    loggerType: process.env.NEST_LOGGER || LoggerTypeEnum.NEST,
    logLevels: logLevels.length ? logLevels : LOG_LEVEL_DEFAULT,
    kafkaConfig: {
      kafka: {
        host: process.env.KAFKA_HOST || 'kafka:9092',
        cliendId: process.env.KAFKA_BROKER_CLIENT_ID,
        constumerGroupId: process.env.KAKFKA_GROUP_ID || 'kafka-core-api',
        authEnabled: envIsTrue(process.env.KAFKA_AUTH_ENABLED),
        sslEnabled: envIsTrue(process.env.KAFKA_SSL_ENABLED),
        credentials: envIsTrue(process.env.KAFKA_AUTH_ENABLED)
          ? {
              password: process.env.KAFKA_PASSWORD || '',
              username: process.env.KAFKA_USERNAME || '',
            }
          : undefined,
      },
      schemaRegistry: {
        url: process.env.SCHEMA_REGISTRY_URL || 'http://schema-registry:8081',
        authEnabled: envIsTrue(process.env.SCHEMA_REGISTRY_AUTH_ENABLED),
        credentials: envIsTrue(process.env.SCHEMA_REGISTRY_AUTH_ENABLED)
          ? {
              username: process.env.SCHEMA_REGISTRY_USERNAME || '',
              password: process.env.SCHEMA_REGISTRY_PASSWORD || '',
            }
          : undefined,
      },
    },
  };
};

export const KAFKA_CONF_ALIAS = 'kafkaConf';

export const regConf = registerAs(KAFKA_CONF_ALIAS, ConfFactory);
