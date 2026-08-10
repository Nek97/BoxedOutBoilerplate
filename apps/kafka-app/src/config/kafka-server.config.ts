/* istanbul ignore file */

import { IKafkaConfig } from '@nestjs-yalc/kafka';
import { KafkaAvroDeserializer } from '@nestjs-yalc/kafka/plugin';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaServerConfig = (
  config: IKafkaConfig,
): NestApplicationContextOptions & KafkaOptions => {
  return {
    transport: Transport.KAFKA,
    options: {
      postfixId: '-consumer',
      client: {
        brokers: [config.kafka.host],
        clientId: config.kafka.cliendId,
        ssl: config.kafka.sslEnabled,
        sasl: config.kafka.credentials
          ? {
              ...config.kafka.credentials,
              mechanism: 'plain',
            }
          : undefined,
      },
      deserializer: new KafkaAvroDeserializer({
        host: config.schemaRegistry.url,
        auth: config.schemaRegistry.credentials,
      }),
      consumer: {
        groupId: config.kafka.constumerGroupId,
        heartbeatInterval: 3000,
        allowAutoTopicCreation: false,
        rebalanceTimeout: 60000,
        sessionTimeout: 30000,

        retry: {
          retries: 5,
          initialRetryTime: 500,
          maxRetryTime: 20000,
        },
      },
      run: {
        autoCommit: true,
      },
      subscribe: {
        fromBeginning: false,
      },
    },
  };
};
