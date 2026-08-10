// @ts-nocheck
/* istanbul ignore file */

import Faker from 'faker';
import { UserDevice } from '../entities/user-device.entity';
import { define } from 'typeorm-seeding';

export const userDeviceFactory = (faker: typeof Faker) => {
  const data = new UserDevice();
  data.guid = faker.datatype.uuid();
  data.timestamp = faker.date.past(3);
  data.token = faker.random.alphaNumeric(40);
  data.secret = faker.random.alphaNumeric(40);

  // -1 is removed, 0 is off and 1 is active.
  data.active = faker.datatype.number({ min: -1, max: 1 });
  data.deviceName = faker.lorem.word();
  data.userAgent = faker.internet.userAgent(); // Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36

  return data;
};

define(UserDevice, userDeviceFactory);
