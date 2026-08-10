import { UserEmailService } from '@boxedout/manage-user/user-email.service';
import { UserService } from '@boxedout/manage-user/user.service';
import { Injectable } from '@nestjs/common';
import { Equal, In, Like, Not } from 'typeorm';
import { UserTagEnum } from '@boxedout-libs/db-boxedoutAdmin/entities/user-tag.enum';
import { UserLockTypeEnum } from '@boxedout-libs/db-boxedout/entities/user.enum';
import { UserIdentityDocumentService } from '@boxedout/manage-user/user-identity-document.service';
import { decryptString } from '@nestjs-yalc/aws-helpers';
import { getEncMode } from '@boxedout-libs/shared/helpers/aws.helper';
import * as zlib from '@nestjs-yalc/utils/zlib.helper';
import { UserTagService } from '@boxedout/manage-monitor/user-tag.service';
import { UserLockService } from '@boxedout/manage-monitor/user-lock.service';
import { ValidationError } from 'apollo-server-fastify';
import { hash as bcryptHash } from 'bcrypt';
import { Operators } from '@nestjs-yalc/ag-grid/ag-grid.enum';
import { UserIdentityDocument } from '@boxedout-libs/db-boxedout/entities/user-identity-document.entity';
import { EmailSenderService } from '@boxedout-libs/shared/emailSender/email-sender.service';
import {
  EmailPriority,
  MultipleAccountReasonEnum,
  MultipleAccountTemplate,
} from '@boxedout-libs/shared/emailSender/email-sender.def';

interface DocumentBaseDataType {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

@Injectable()
export class MultipleDocumentIdService {
  constructor(
    private userService: UserService,
    private userEmail: UserEmailService,
    private userTagService: UserTagService,
    private userLockService: UserLockService,
    private userIdentityDocumentService: UserIdentityDocumentService,
    private emailSender: EmailSenderService,
  ) {}

  public async applyChecks(
    guid: string,
    documentBaseDataHash: string,
    documentNumberHash: string,
  ) {
    if (await this.isInternalAccount(guid)) return null;

    // If not internal find Duplicate
    const duplicateDocumentId = await this.findDuplicateDocumentId(
      documentBaseDataHash,
      documentNumberHash,
      guid,
    );

    if (!duplicateDocumentId.length) return null;

    const activeAccount = await this.findActiveAccount(
      duplicateDocumentId.map((v) => v.guid),
    );
    if (activeAccount.length)
      return this.applyLock(guid, MultipleAccountReasonEnum.ACTIVE_ACCOUNT);

    const offboarded = await this.findOffboardedAccount(
      duplicateDocumentId.map((v) => v.guid),
    );
    if (offboarded.length)
      return this.applyLock(guid, MultipleAccountReasonEnum.OFFBOARDED_ACCOUNT);

    return null;
  }

  public async extractDocumentInfo(data: string) {
    const { onfido, manual } = JSON.parse(data);

    // Manual data takes priority on onfido data
    if (manual) {
      const decryptData = JSON.parse(await decryptString(manual, getEncMode()));

      const decryptedDocumentNumber = decryptData.documentNumber;

      const decryptedDocumentData: DocumentBaseDataType = {
        firstName: decryptData.firstName,
        lastName: decryptData.lastName,
        dateOfBirth: decryptData.dateOfBirth,
      };

      return this.hashDocumentInfo(
        decryptedDocumentNumber,
        decryptedDocumentData,
      );
    }

    if (onfido) {
      const { document } = JSON.parse(
        zlib.inflate(await decryptString(onfido, getEncMode())),
      );

      const decryptedDocumentNumber: string[] =
        document.properties.document_numbers
          .filter((v: any) => v.type === 'document_number')
          .map((v: any) => v.value);

      const decryptedDocumentData: DocumentBaseDataType = {
        firstName: document.properties.first_name,
        lastName: document.properties.last_name,
        dateOfBirth: document.properties.date_of_birth,
      };

      return this.hashDocumentInfo(
        decryptedDocumentNumber[0],
        decryptedDocumentData,
      );
    }

    throw new ValidationError('Document data error');
  }

  private async hashDocumentInfo(
    documentNumber: string,
    documentData: DocumentBaseDataType,
  ) {
    if (!process.env.HASH_SALT)
      throw new Error('Encryption error: salt is missed');

    const documentNumberHash = await bcryptHash(
      documentNumber,
      process.env.HASH_SALT,
    );
    const documentBaseDataHash = await bcryptHash(
      JSON.stringify(documentData),
      process.env.HASH_SALT,
    );

    return {
      documentNumberHash,
      documentBaseDataHash,
    };
  }

  private async isInternalAccount(guid: string) {
    const isBoxedOutAccount = await this.userEmail.getEntity({
      guid,
      email: Like('%@boxedout.com%'),
    });

    const hasCorporateTag = await this.userTagService.getEntity({
      guid,
      tag: UserTagEnum.CORPORATE,
    });

    return isBoxedOutAccount || hasCorporateTag;
  }

  private async findActiveAccount(guidList: string[]) {
    return this.userService.getEntityList({
      where: {
        guid: In(guidList),
        accountDeleted: 0,
      },
    });
  }

  private async findOffboardedAccount(guidList: string[]) {
    return this.userTagService.getEntityList({
      where: {
        guid: In(guidList),
        tag: UserTagEnum.OFFBOARDING_DONE,
      },
    });
  }

  private async applyLock(guid: string, reason: MultipleAccountReasonEnum) {
    await this.userLockService.lockAccount(
      UserLockTypeEnum.MULTIPLE_ACCOUNT_LOCK,
      guid,
      'boxedout',
    );

    const template = new MultipleAccountTemplate({
      reason: reason,
      solution: reason,
    });
    await this.emailSender.sendEmail(guid, template, EmailPriority.HIGH);
  }

  private async findDuplicateDocumentId(
    documentBaseDataHash: string,
    documentNumberHash: string,
    guid: string,
  ): Promise<UserIdentityDocument[]> {
    return this.userIdentityDocumentService
      .getRepository()
      .getAgGridQueryBuilder({
        select: ['guid'],
        where: {
          filters: { status: Equal('verified'), guid: Not(guid) },
          operator: Operators.AND,
          childExpressions: [
            {
              filters: {
                documentBaseDataHash: Equal(documentBaseDataHash),
                documentNumberHash: Equal(documentNumberHash),
              },
              operator: Operators.OR,
            },
          ],
        },
      })
      .getMany();
  }
}
