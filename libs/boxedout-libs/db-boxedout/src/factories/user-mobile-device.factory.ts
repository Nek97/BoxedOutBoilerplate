// @ts-nocheck
/* istanbul ignore file */

import Faker from 'faker';
import { UserMobileDevice } from '../entities/user-mobile-device.entity';
import { define } from 'typeorm-seeding';

const infoExamples = [
  'SM-G950F',
  'SM-G955F',
  'iPhone12,1',
  'iPhone7,2',
  'iPhone11,8',
];

export const userMobileDeviceFactory = (faker: typeof Faker) => {
  const data = new UserMobileDevice();
  data.guid = faker.datatype.uuid();
  data.timestamp = faker.date.past(3);
  data.secret = faker.random.alphaNumeric(40);

  // -1 is removed, 0 is off and 1 is active.
  data.active = faker.datatype.number({ min: -1, max: 1 });
  data.token = faker.random.alphaNumeric(40);
  data.deviceName = faker.lorem.word();
  data.deviceInfo = faker.random.arrayElement(infoExamples);

  return data;
};

define(UserMobileDevice, userMobileDeviceFactory);
