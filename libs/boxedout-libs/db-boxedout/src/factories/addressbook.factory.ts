// @ts-nocheck
/* istanbul ignore file */

import Faker from 'faker';
import { Addressbook } from '../entities/addressbook.entity';
import { define } from 'typeorm-seeding';
import {
  AddressbookReason,
  AddressbookStatusCompliance,
  AddressbookStatusSecurity,
} from '../entities/addressbook.enum';
import { FakerHelper } from '@nestjs-yalc/utils/faker-helper';
import { AssetCodeEnum } from '@boxedout-libs/shared/asset.enum';

const fakerHelper = new FakerHelper();

export const addressbookFactory = (faker: typeof Faker) => {
  const date = faker.date.past(3);

  const data = new Addressbook();
  data.uuid = faker.datatype.uuid();
  data.guid = faker.datatype.uuid();
  data.created = date;
  data.updated = date;
  data.asset = AssetCodeEnum.BTC;
  data.address = faker.random.alphaNumeric(256);
  data.paymentId = faker.random.alphaNumeric(512);
  data.name = faker.name.firstName();
  data.emailToken = faker.random.alphaNumeric(40);
  data.statusCompliance = fakerHelper.randomFromEnum(
    AddressbookStatusCompliance,
  );
  data.methodCompliance = `video:${faker.datatype.uuid()}`;
  data.methodComplianceVerified = 'manual';
  data.ocrData = '';
  data.reason = AddressbookReason.OTHER;
  data.service = '';
  data.custodial = faker.datatype.number(1);
  data.statusSecurity = fakerHelper.randomFromEnum(AddressbookStatusSecurity);
  data.metadata = 'something';

  return data;
};

define(Addressbook, addressbookFactory);
