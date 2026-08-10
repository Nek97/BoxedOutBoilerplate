import { DynamicModule, Module } from '@nestjs/common';
import SnappyCodec from 'kafkajs-snappy';
import { CompressionCodecs, CompressionTypes } from 'kafkajs';
import { registerAs } from '@nestjs/config';
import { CURAPP_CONF_ALIAS } from '@boxedout-libs/shared/def.const';
import { regConf } from './config/service';
import {
  AppDependencyFactory,
  IAppImportsFactory,
} from '@boxedout-libs/shared/app-helpers/app-imports.factory';
import { dbConf, regDbConf } from './config/databases';
import { KafkaUserModule } from '@boxedout/kafka-user/kafka-user.module';
import { KafkaCryptoModule } from '@boxedout/kafka-crypto/kafka-crypto.module';
import { envIsTrue } from '@nestjs-yalc/utils/env.helper';

// Here we need to import our KafkaService
/**
 * Snappy conversion
 */
CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec;
export interface IAppModuleOptions extends IAppImportsFactory {
  setupDatabases?: boolean;
  setupAppModules?: boolean;
}
@Module({})
export class KafkaAppModule {
  static forRoot(options: IAppModuleOptions = {}): DynamicModule {
    const { setupAppModules = true, setupDatabases = true } = options;

    const confs: any[] = [];
    const dbConn: string[] = [];

    const curAppConf = registerAs(
      CURAPP_CONF_ALIAS,
      /*istanbul ignore next */
      () => regConf(),
    );

    dbConf.map((v) => dbConn.push(v.connName));
    confs.push(curAppConf, regConf, ...regDbConf);

    const { imports, providers } = AppDependencyFactory(
      'kafka-app',
      confs,
      setupDatabases ? dbConn : [],
      [],
      {
        setupJwt: false,
        keepDBConnectionAlive: true,
      },
    );

    if (setupAppModules) {
      if (!envIsTrue(process.env.DISABLE_KAFKA_USER_MODULE))
        imports.push(KafkaUserModule);

      if (!envIsTrue(process.env.DISABLE_KAFKA_CRYPTO_MODULE))
        imports.push(KafkaCryptoModule);
    }

    return {
      module: KafkaAppModule,
      imports,
      providers,
    };
  }
}
