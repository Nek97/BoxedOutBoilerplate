// @ts-nocheck
import { Global, Module } from '@nestjs/common';
import { SentryService } from './sentry.service';
import { ConfigService } from '@nestjs/config';
import { IServiceConf } from '@boxedout-libs/shared/conf.type';
import { CURAPP_CONF_ALIAS } from '@boxedout-libs/shared/def.const';
import { GqlSentryPlugin } from './plugin/sentry-gql.plugin';
import { SentryPlugin } from './plugin/sentry.plugin';
import { GqlGatewaySentryPlugin } from './plugin/sentry-gateway-gql.plugin';

export async function makeSentryService(configService: ConfigService) {
  const conf = configService.get<IServiceConf>(CURAPP_CONF_ALIAS);
  if (!conf || !conf.sentryModuleConf) return null;
  return new SentryService(conf.sentryModuleConf.sentryOptions);
}

@Global()
@Module({
  providers: [
    {
      provide: SentryService,
      useFactory: makeSentryService,
      inject: [ConfigService],
    },
    GqlSentryPlugin,
    GqlGatewaySentryPlugin,
    SentryPlugin,
  ],
  exports: [GqlSentryPlugin, SentryService, GqlGatewaySentryPlugin],
})
export class SentryModule {}
