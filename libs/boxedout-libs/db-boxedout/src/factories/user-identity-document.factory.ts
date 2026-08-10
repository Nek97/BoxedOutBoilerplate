// @ts-nocheck
/* istanbul ignore file */

import Faker from 'faker';
import { UserIdentityDocument } from '../entities/user-identity-document.entity';
import * as localEncryption from '@nestjs-yalc/utils/encryption.helper';
import * as zlib from '@nestjs-yalc/utils/zlib.helper';
import {
  UserIdentityReasonEnum,
  UserIdentityStatusEnum,
} from '../entities/user-identity-document.enum';
import { define } from 'typeorm-seeding';
import {
  DEF_FAKER_MAX_RETRIES,
  FakerHelper,
} from '@nestjs-yalc/utils/faker-helper';
import { randomBool } from '@boxedout-libs/shared/seeder-helper';

const fakerHelper = new FakerHelper();

const staticKey =
  'be088f8bb64166cc2938b1dd0c9db8fa223edd975f48462858a41f70ebee1c5f';

export const userIdentityDocumentFactory = (faker: typeof Faker) => {
  const userIdentityDocument = new UserIdentityDocument();

  const data = {
    onfido: localEncryption.encryptAes(
      zlib.deflate(JSON.stringify(dynamicReports())).toString('base64'),
      staticKey,
    ),
  };
  userIdentityDocument.xx = faker.unique(faker.datatype.number, [], {
    maxRetries: DEF_FAKER_MAX_RETRIES,
  });
  userIdentityDocument.guid = faker.datatype.uuid();
  userIdentityDocument.status = fakerHelper.randomFromEnum(
    UserIdentityStatusEnum,
  );

  userIdentityDocument.verifiedTimestamp = new Date();
  userIdentityDocument.verificationLock = new Date();
  if (userIdentityDocument.status === UserIdentityStatusEnum.REJECTED) {
    // use - 2, since in the database nonexisting reason is an empty string, also means we cannot use randomFromEnum
    // we added the reason EMPTY which is '' (but which should not be generated through factory)
    const randInt = faker.datatype.number(
      Object.keys(UserIdentityReasonEnum).length - 2,
    );
    const userIdentityReason = Object.keys(UserIdentityReasonEnum)[randInt];
    userIdentityDocument.reason =
      UserIdentityReasonEnum[
        userIdentityReason as keyof typeof UserIdentityReasonEnum
      ];
  } else {
    userIdentityDocument.reason = UserIdentityReasonEnum.EMPTY;
  }
  userIdentityDocument.timestamp = new Date();
  userIdentityDocument.data = JSON.stringify(data);

  return userIdentityDocument;
};

export const reports = {
  document: {
    name: 'document',
    id: 'a4dfaddc1-abcd-4a6a-abcd-7fe40b824a02',
    created_at: '2020-12-22T12:41:17.000Z',
    href: '/v2/checks/a4dfaddc1-abcd-45bc-abcd-514e5fa34349/reports/a4dfaddc1-abcd-4a6a-b626-7fe40b824a02',
    status: 'complete',
    result: 'clear',
    sub_result: 'clear',
    breakdown: {
      data_comparison: {
        result: null,
        breakdown: {
          date_of_expiry: { result: null, properties: {} },
          issuing_country: { result: null, properties: {} },
          document_type: { result: null, properties: {} },
          document_numbers: { result: null, properties: {} },
          gender: { result: null, properties: {} },
          date_of_birth: { result: null, properties: {} },
          last_name: { result: null, properties: {} },
          first_name: { result: null, properties: {} },
        },
      },
      visual_authenticity: {
        result: 'clear',
        breakdown: {
          other: { result: 'clear', properties: {} },
          fonts: { result: 'clear', properties: {} },
          face_detection: { result: 'clear', properties: {} },
          security_features: { result: 'clear', properties: {} },
          template: { result: 'clear', properties: {} },
          digital_tampering: { result: 'clear', properties: {} },
          picture_face_integrity: { result: 'clear', properties: {} },
          original_document_present: { result: 'clear', properties: {} },
        },
      },
      data_consistency: {
        result: 'clear',
        breakdown: {
          date_of_expiry: { result: 'clear', properties: {} },
          document_type: { result: 'clear', properties: {} },
          nationality: { result: null, properties: {} },
          issuing_country: { result: 'clear', properties: {} },
          document_numbers: { result: 'clear', properties: {} },
          gender: { result: 'clear', properties: {} },
          date_of_birth: { result: 'clear', properties: {} },
          last_name: { result: 'clear', properties: {} },
          first_name: { result: 'clear', properties: {} },
        },
      },
      data_validation: {
        result: 'clear',
        breakdown: {
          document_expiration: { result: 'clear', properties: {} },
          gender: { result: 'clear', properties: {} },
          document_numbers: { result: 'clear', properties: {} },
          expiry_date: { result: 'clear', properties: {} },
          date_of_birth: { result: 'clear', properties: {} },
          mrz: { result: 'clear', properties: {} },
        },
      },
      compromised_document: { result: 'clear' },
      police_record: { result: 'clear' },
      image_integrity: {
        result: 'clear',
        breakdown: {
          conclusive_document_quality: { result: 'clear', properties: {} },
          colour_picture: { result: 'clear', properties: {} },
          supported_document: { result: 'clear', properties: {} },
          image_quality: { result: 'clear', properties: {} },
        },
      },
      age_validation: {
        result: 'clear',
        breakdown: {
          minimum_accepted_age: { result: 'clear', properties: {} },
        },
      },
    },
    properties: {
      first_name: 'FIRSTNAME MIDDLENAME',
      last_name: 'LAST NAME',
      gender: 'Male',
      nationality: 'NLD',
      issuing_country: 'NLD',
      document_numbers: [{ type: 'document_number', value: 'ABCDEFGH12' }],
      document_type: 'national_identity_card',
      date_of_birth: '1970-01-30',
      date_of_expiry: '2025-01-30',
      mrz_line1: 'I<NLDABCDEFGHIJKL<<<<<8',
      mrz_line2: '12050615NLD<<<<<<<<<<<4',
      mrz_line3: 'LASTNAME<<FIRST<MIDDLE<<<<<<<<<<<',
    },
    variant: 'standard',
    documents: [
      { id: 'a4dfaddc1-abcd-42d1-b253-7a3ed4d71fe9' },
      { id: 'a4dfaddc1-abcd-4863-b7f9-99fa4f3f0a49' },
    ],
  },
  facial_similarity: {
    name: 'facial_similarity',
    id: 'a4dfaddc1-abcd-45c1-946b-cc74b9c7953a',
    created_at: '2020-12-22T12:41:17.000Z',
    href: '/v2/checks/a4dfaddc1-abcd-45bc-b217-514e5fa34349/reports/a4dfaddc1-abcd-45c1-946b-cc74b9c7953a',
    status: 'complete',
    result: 'clear',
    sub_result: 'clear',
    breakdown: {
      face_comparison: { result: 'clear' },
      image_integrity: {
        result: 'clear',
        breakdown: {
          face_detected: { result: 'clear', properties: {} },
          source_integrity: { result: 'clear', properties: {} },
        },
      },
      visual_authenticity: { result: 'clear' },
    },
    properties: { score: 0.9077 },
    variant: 'standard',
    documents: [],
  },
};

define(UserIdentityDocument, userIdentityDocumentFactory);

export function dynamicReports() {
  const reportsUpdated = reports;
  reportsUpdated.document.sub_result = randomBool() ? 'clear' : 'suspected';
  reportsUpdated.facial_similarity.sub_result = randomBool()
    ? 'clear'
    : 'suspected';
  return reportsUpdated;
}
