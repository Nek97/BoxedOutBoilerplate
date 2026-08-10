// @ts-nocheck
/* istanbul ignore file */

import Faker from 'faker';
import { UserPhone } from '../entities/user-phone.entity';
import { define } from 'typeorm-seeding';

export const userPhoneFactory = (faker: typeof Faker) => {
  const data = new UserPhone();
  data.guid = faker.datatype.uuid();
  const format =
    faker.datatype.number(1) === 1 ? '+316-########' : '+31##-#######';
  data.phone = faker.phone.phoneNumber(format);
  data.status = faker.datatype.number(1) ? 'pending' : 'verified';
  data.active = faker.datatype.number(1);
  data.token = faker.random.alphaNumeric(40);
  data.timestamp = faker.date.past(3);

  return data;
};

define(UserPhone, userPhoneFactory);
