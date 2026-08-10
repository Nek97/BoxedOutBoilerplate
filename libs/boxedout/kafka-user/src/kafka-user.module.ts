/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConnection } from '@boxedout-libs/shared/db-default.conf';
import { KafkaUserIdController } from './controllers';
import {
  ActiveSessionRepository,
  UserEmailRepository,
  UserFileRepository,
  UserIdentityDocumentRepository,
  UserRepository,
} from '@boxedout-libs/db-boxedout';
import {
  CommentRepository,
  UserTagRepository,
} from '@boxedout-libs/db-boxedoutAdmin';
import { OnfidoRepository } from '@boxedout-libs/db-kyc';
import { MultipleDocumentIdService } from '@boxedout/manage-user/multiple-documentId.service';
import { UserServiceFactory } from '@boxedout/manage-user/user.service';
import { UserLockService } from '@boxedout/manage-monitor/user-lock.service';
import { UserTagService } from '@boxedout/manage-monitor/user-tag.service';
import { UserEmailServiceFactory } from '@boxedout/manage-user/user-email.service';
import { UserIdentityDocumentService } from '@boxedout/manage-user/user-identity-document.service';
import { CommentService } from '@boxedout/manage-monitor/comment.service';
import { EmailSenderModule } from '@boxedout-libs/shared/emailSender/email-sender.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        UserEmailRepository,
        UserIdentityDocumentRepository,
        UserRepository,
        ActiveSessionRepository,
        UserFileRepository,
      ],
      DbConnection.BOXEDOUT,
    ),
    TypeOrmModule.forFeature(
      [UserTagRepository, CommentRepository],
      DbConnection.BOXEDOUT_ADMIN,
    ),
    TypeOrmModule.forFeature([OnfidoRepository], DbConnection.KYC),
    EmailSenderModule,
  ],
  exports: [],
  providers: [
    MultipleDocumentIdService,
    UserEmailServiceFactory(DbConnection.BOXEDOUT),
    UserServiceFactory(DbConnection.BOXEDOUT),
    UserLockService,
    UserTagService,
    CommentService,
    UserIdentityDocumentService,
  ],
  controllers: [KafkaUserIdController],
})
export class KafkaUserModule {}
