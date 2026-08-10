// @ts-nocheck
import type { LogLevel } from '@nestjs/common';
import type { LoggerTypeEnum } from '@nestjs-yalc/logger/logger.enum';
import type { SentryModuleOptions } from '@boxedout-libs/sentry';
import type { IKafkaConfig } from '@nestjs-yalc/kafka';
import type { EmailSenderModuleOptions } from './emailSender/email-sender.def';

interface IServiceConfBase {
  appName: string;
  apiPrefix: string;
  loggerType: LoggerTypeEnum | string;
  logLevels: LogLevel[];
  /** You can specialize log levels per each logger context. By default logLevels is used instead */
  logContextLevels?: { [key: string]: LogLevel[] };
  domain: string;

  host: string;
  port: number;
  isDev: boolean;
  isTest: boolean;
  isPipeline: boolean;
  isProduction: boolean;
  playground?: boolean;
  env: typeof process.env.NODE_ENV;
}

export interface IServiceConf extends IServiceConfBase {
  jwtIssuer: string;
  jwtSecretPrivate: string;
  jwtSecretPublic: string;
  jwtSecretMobile: string;
  apiPrefix: string;
  basePath: string;
  operationPrefix: string;
  sentryModuleConf?: SentryModuleOptions;
  emailSenderConfig?: EmailSenderModuleOptions;
}

export interface IServiceConfKafka extends IServiceConfBase {
  kafkaConfig: IKafkaConfig;
}
