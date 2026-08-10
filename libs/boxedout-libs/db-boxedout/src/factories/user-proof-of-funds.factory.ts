// @ts-nocheck
/* istanbul ignore file */

import Faker from 'faker';
import { define } from 'typeorm-seeding';
import {
  DEF_FAKER_MAX_RETRIES,
  FakerHelper,
} from '@nestjs-yalc/utils/faker-helper';
import { UserProofOfFunds } from '../entities/user-proof-of-funds.entity';
import { UserProofOfFundsStatusEnum } from '../entities/user-proof-of-funds.enum';

const fakerHelper = new FakerHelper();

export const userProofOfFundsFactory = (faker: typeof Faker) => {
  const userProofOfFunds = new UserProofOfFunds();
  const oneHour = 60 * 60 * 1000;

  userProofOfFunds.xx = faker.unique(faker.datatype.number, [], {
    maxRetries: DEF_FAKER_MAX_RETRIES,
  });
  userProofOfFunds.guid = faker.datatype.uuid();
  userProofOfFunds.status = fakerHelper.randomFromEnum(
    UserProofOfFundsStatusEnum,
  );
  userProofOfFunds.timestamp = faker.date.past(3);
  if (userProofOfFunds.status === UserProofOfFundsStatusEnum.VERIFIED) {
    userProofOfFunds.verifiedTimestamp = new Date(
      userProofOfFunds.timestamp.valueOf() +
        faker.datatype.number(120) * oneHour,
    );
  }
  userProofOfFunds.fileUuids = faker.datatype.uuid();

  return userProofOfFunds;
};

define(UserProofOfFunds, userProofOfFundsFactory);
