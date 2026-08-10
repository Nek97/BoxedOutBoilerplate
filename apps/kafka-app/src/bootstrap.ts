/* istanbul ignore file */

/* eslint-disable no-console */
import { IServiceConfKafka } from '@boxedout-libs/shared/conf.type';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { kafkaServerConfig } from './config/kafka-server.config';
import { KAFKA_CONF_ALIAS } from './config/service';
import { KafkaExceptionFilter } from './exception.filter';
import { KafkaAppModule } from './kafka-app.module';

export async function bootstrap(envPath?: string | string[]) {
  console.debug('Application Microservice bootstrap');

  const appContext = await NestFactory.createApplicationContext(
    KafkaAppModule.forRoot({ envPath }),
  );
  const configService = await appContext.get(ConfigService);
  await appContext.close();

  const kafkaConfig =
    configService.get<IServiceConfKafka>(KAFKA_CONF_ALIAS)?.kafkaConfig;

  if (!kafkaConfig) {
    console.error(' Kafka Configuration not defined ');
    process.exit(1);
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    KafkaAppModule.forRoot({ envPath }),
    kafkaServerConfig(kafkaConfig),
  );

  app.useGlobalFilters(new KafkaExceptionFilter());

  app.listen().catch((error) => {
    // use in K8S to restart the pod
    console.error('Process exit due to ' + error.name);
    process.exit(1);
  });
}

export async function bootstrapDryRun(envPath?: string | string[]) {
  const withDatabase = !process.env.APP_DRY_RUN_NO_DB;

  const appContext = await NestFactory.createApplicationContext(
    KafkaAppModule.forRoot({
      envPath,
      setupAppModules: withDatabase,
      setupDatabases: withDatabase,
    }),
  );
  const configService = await appContext.get(ConfigService);
  await appContext.close();

  const kafkaConfig =
    configService.get<IServiceConfKafka>(KAFKA_CONF_ALIAS)?.kafkaConfig;

  if (!kafkaConfig) {
    console.error(' Kafka Configuration not defined ');
    process.exit(1);
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    KafkaAppModule.forRoot({
      envPath,
      setupAppModules: withDatabase,
      setupDatabases: withDatabase,
    }),
    kafkaServerConfig(kafkaConfig),
  );

  console.log('______DRY RUN_____');
  try {
    await app.get(ConfigService);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  process.exit(0);
}
