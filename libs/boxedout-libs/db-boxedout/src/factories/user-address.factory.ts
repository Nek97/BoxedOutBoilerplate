// @ts-nocheck
/* istanbul ignore file */

import Faker from 'faker';
import { UserAddress } from '../entities/user-address.entity';
import { define } from 'typeorm-seeding';

export const userAddressFactory = (faker: typeof Faker) => {
  const address = faker.address;

  const data = new UserAddress();
  data.guid = faker.datatype.uuid();
  data.address = address.streetAddress(true);
  data.address2 = address.streetSuffix();
  data.city = address.city();
  data.country = address.countryCode();
  data.postalCode = address.zipCode();
  data.verificationStatus = 'verified';

  return data;
};

define(UserAddress, userAddressFactory);
