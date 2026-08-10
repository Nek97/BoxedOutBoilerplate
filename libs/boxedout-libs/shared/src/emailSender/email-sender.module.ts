// @ts-nocheck
const EmailDbModule = { forRoot: () => ({ module: class {} }) };
const EmailDbService = class {};
const DbConnection = { EMAIL: "EMAIL" };
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { IServiceConf } from '../conf.type';
import { DbConnection } from '../db-default.conf';
import { CURAPP_CONF_ALIAS } from '../def.const';
import { EmailSenderService } from './email-sender.service';

export function makeEmailSenderService(
  repository: EmailQueueRepository,
  configService: ConfigService,
) {
  const conf = configService.get<IServiceConf>(CURAPP_CONF_ALIAS);
  return new EmailSenderService(repository, conf?.emailSenderConfig?.awsConfig);
}
@Module({
  providers: [
    {
      provide: EmailSenderService,
      useFactory: makeEmailSenderService,
      inject: [
        getRepositoryToken(EmailQueueRepository, DbConnection.EMAIL),
        ConfigService,
      ],
    },
  ],
  imports: [
    TypeOrmModule.forFeature([EmailQueueRepository], DbConnection.EMAIL),
  ],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}
