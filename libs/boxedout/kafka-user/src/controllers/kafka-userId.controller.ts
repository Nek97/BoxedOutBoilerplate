import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaTopic } from '../topic.enum';
import { DeserializedData } from '@nestjs-yalc/kafka';
import { MultipleDocumentIdService } from '@boxedout/manage-user/multiple-documentId.service';
import {
  UserIdentityDocument,
  UserIdentityStatusEnum,
} from '@boxedout-libs/db-boxedout';
import { UserIdentityDocumentService } from '@boxedout/manage-user/user-identity-document.service';
import { envIsTrue } from '@nestjs-yalc/utils/env.helper';

type PayloadKey = {
  guid: string;
};

type PayloadValue = UserIdentityDocument;

@Controller()
export class KafkaUserIdController {
  constructor(
    private multipleDocumentIdService: MultipleDocumentIdService,
    private userIdentityDocumentService: UserIdentityDocumentService,
  ) {}

  @EventPattern(KafkaTopic.BOXEDOUT_USERID)
  public async checkDuplicateDocumentId(
    @Payload()
    payload: DeserializedData<PayloadKey, PayloadValue>,
  ) {
    const { key, value } = payload;

    /* istanbul ignore next */
    if (envIsTrue(process.env.RESET_TOPIC_OFFSET)) return;
    /*
     * Do nothing if status is still the same (does not matter which type)
     */
    if (value.op === 'u' && value.after?.status === value.before?.status)
      return;

    if (
      ['c', 'u'].includes(value.op) &&
      value.after?.status === UserIdentityStatusEnum.VERIFIED
    ) {
      const entity = await this.userIdentityDocumentService.getEntity(
        { xx: value.after.xx },
        ['data', 'status', 'documentBaseDataHash', 'documentNumberHash'],
      );
      /**
       * We cannot go on if the values has been changed in the meanwhile
       */
      if (!entity || entity.status !== UserIdentityStatusEnum.VERIFIED) return;

      const { documentBaseDataHash, documentNumberHash } =
        await this.multipleDocumentIdService.extractDocumentInfo(entity.data);

      /**
       *  Update and apply checks the userIdentityDocument hashing column only if different
       *  This will always happen when the fields are updated, so we don't want to go ahead
       *  to avoid the loop
       */
      if (
        entity.documentBaseDataHash === documentBaseDataHash &&
        entity.documentNumberHash === documentNumberHash
      )
        return;

      await this.userIdentityDocumentService.updateEntity(
        { xx: value.after.xx },
        {
          documentBaseDataHash: documentBaseDataHash,
          documentNumberHash: documentNumberHash,
        },
      );

      // Apply checks
      if (envIsTrue(process.env.ENABLE_MULTIPLE_ACCOUNT_CHECK))
        await this.multipleDocumentIdService.applyChecks(
          key.guid,
          documentBaseDataHash,
          documentNumberHash,
        );
    }
  }
}
