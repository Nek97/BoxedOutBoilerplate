import { ConfigService } from '@nestjs/config';
import { CURAPP_CONF_ALIAS } from '@boxedout-libs/shared/def.const';
import { IServiceConf } from '../conf.type';
import { AppLoggerFactory } from '@nestjs-yalc/logger/logger.factory';
import { LogLevel } from '@nestjs/common';

export const AppLoggerService = (provide: string, context: string) => ({
  provide: provide,
  useFactory: async (config: ConfigService) => {
    const conf = config.get<IServiceConf>(CURAPP_CONF_ALIAS);
    const loggerType = conf?.loggerType;
    const loggerLevels: LogLevel[] =
      conf?.logContextLevels?.[context] || conf?.logLevels || [];
    return AppLoggerFactory(context, loggerLevels, loggerType);
  },
  inject: [ConfigService],
});
