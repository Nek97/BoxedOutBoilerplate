// @ts-nocheck
/* istanbul ignore file */

import Faker from 'faker';
import { UserEmail } from '../entities/user-email.entity';
import { define } from 'typeorm-seeding';
import { FakerHelper } from '@nestjs-yalc/utils/faker-helper';

const fakerHelper = new FakerHelper();

export const userEmailFactory = (faker: typeof Faker) => {
  const person = fakerHelper.createPerson();

  const data = new UserEmail();
  data.guid = faker.datatype.uuid();
  data.email = person.email;
  data.status = faker.datatype.number(1) ? 'pending' : 'verified';
  data.active = faker.datatype.number(1);
  data.reminded = faker.datatype.number(1);
  data.token = faker.random.alphaNumeric(40);
  data.timestamp = faker.date.past(3);
  data.lastLoginFailed = faker.date.recent();
  data.lastPasswordReset = faker.date.recent();
  data.lastTwoFactorReset = faker.date.recent();

  return data;
};

define(UserEmail, userEmailFactory);
