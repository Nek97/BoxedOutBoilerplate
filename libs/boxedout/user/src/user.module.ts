/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DbConnection } from '@boxedout-libs/shared/db-default.conf';
import { userAddressDeps } from './user-address.resolver';
import { UserAddressController } from './user-address.controller';
import { UserServiceFactory } from '@boxedout/manage-user/user.service';
import {
  ActiveSessionRepository,
  UserLogGlobalRepository,
  UserLogRepository,
  UserRepository,
} from '@boxedout-libs/db-boxedout';
import { AuditUserLogListener } from './listeners/audit-user-log.listener';
import { UserLogService } from '@boxedout/manage-user/user-log.service';
import { UserPasswordController } from './user-password.controller';
import { UserPasswordService } from './user-password.service';
import { BoxedOutLegacyService } from './legacy/boxedout-legacy.service';
import { RedisModule } from '@boxedout-libs/redis';
import { EmailSenderModule } from '@boxedout-libs/shared/emailSender/email-sender.module';
import { IdentityManagerClientModule } from '../../../boxedout-libs/identity-manager-client/src/identity-manager-client.module';
import { UserEmailService } from '@boxedout/user/user-email.service';
import { UserEmailController } from '@boxedout/user/user-email-controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        UserRepository,
        ActiveSessionRepository,
        userAddressDeps.repository,
        UserLogRepository,
      ],
      DbConnection.BOXEDOUT,
    ),
    TypeOrmModule.forFeature(
      [UserLogGlobalRepository],
      DbConnection.BOXEDOUT_GLOBAL,
    ),
    RedisModule,
    IdentityManagerClientModule,
    EmailSenderModule,
  ],
  exports: [...userAddressDeps.providers],
  providers: [
    UserServiceFactory(DbConnection.BOXEDOUT),
    ConfigService,
    ...userAddressDeps.providers,
    UserLogService,
    AuditUserLogListener,
    UserLogRepository,
    UserLogGlobalRepository,
    BoxedOutLegacyService,
    UserPasswordService,
    UserEmailService,
  ],
  controllers: [
    UserAddressController,
    UserPasswordController,
    UserEmailController,
  ],
})
export class UserModule {}
