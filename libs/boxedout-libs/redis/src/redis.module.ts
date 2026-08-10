// @ts-nocheck
import { IServiceConf } from '@boxedout-libs/shared/conf.type';
import { CURAPP_CONF_ALIAS } from '@boxedout-libs/shared/def.const';
import { PubSubService } from '@boxedout-libs/redis';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface IRedisConf {
  enabled: boolean;
  host: string;
  port: number;
}

export async function makePubSubService(configService: ConfigService) {
  const conf = configService.get<IServiceConf & { redisConfig: IRedisConf }>(
    CURAPP_CONF_ALIAS,
  );

  if (!conf || !conf.redisConfig?.enabled) return null;

  PubSubService.init(conf.redisConfig);
  return PubSubService.getInstance();
}

@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: makePubSubService,
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {
  async onModuleDestroy() {
    const instance = PubSubService.getInstance();
    await new Promise((resolve, reject) => {
      instance.getPub().quit((err, reply) => {
        if (err) return reject(err);

        return resolve(reply);
      });
    });

    await new Promise((resolve, reject) => {
      instance.getSub().quit((err, reply) => {
        if (err) return reject(err);

        return resolve(reply);
      });
    });
  }
}
