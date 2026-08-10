// @ts-nocheck
/* istanbul ignore file */

import { AdminLog } from '../entities/admin-log.entity';
import Faker from 'faker';
import { AdminLogTypeEnum } from '../entities/admin-log.enum';
import { define } from 'typeorm-seeding';
import {
  DEF_FAKER_MAX_RETRIES,
  FakerHelper,
} from '@nestjs-yalc/utils/faker-helper';

const fakerHelper = new FakerHelper();

const typeToData = {
  [AdminLogTypeEnum.BANK_ACCOUNT_APPROVED]: '{"bank":"NL08BUNQ123456789"}',
  [AdminLogTypeEnum.BANK_ACCOUNT_PENDING]: '{"bank":"NL08BUNQ123456789"}',
  [AdminLogTypeEnum.BANK_ACCOUNT_REJECTED]:
    '{"bank":"NL08BUNQ123456789","reason":"name_does_not_match"}',
  [AdminLogTypeEnum.TRANSACTION_APPROVED]: '{"xxTransaction":2026}',
  [AdminLogTypeEnum.TRANSACTION_REJECTED]: '{"xxTransaction":15694}',
  [AdminLogTypeEnum.USER_DELETE]: '{"type":"iban","value":"NL08BUNQ123456789"}',
  [AdminLogTypeEnum.USER_INSPECTION_RISK]: '{"riskType":"proxy","risk":0}',
  [AdminLogTypeEnum.USER_LOCK]:
    '{"type":"withdrawal","timestamp":"2030-01-01 12:00:00"}',
};

export const adminLogFactory = (faker: typeof Faker) => {
  const adminLog = new AdminLog();
  adminLog.xx = faker.unique(faker.datatype.number, [{ min: 1 }], {
    maxRetries: DEF_FAKER_MAX_RETRIES,
  });
  adminLog.guid = faker.datatype.uuid();
  adminLog.target = faker.datatype.uuid();
  adminLog.timestamp = new Date();
  adminLog.ip = faker.internet.ip();
  adminLog.userAgent = faker.internet.userAgent(); // Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36
  adminLog.type = fakerHelper.randomFromEnum(AdminLogTypeEnum);
  // should be equal to the token from user-device
  adminLog.device = faker.random.alphaNumeric(40);
  adminLog.data =
    adminLog.type in typeToData
      ? typeToData[adminLog.type as keyof typeof typeToData]
      : '';
  return adminLog;
};

define(AdminLog, adminLogFactory);
