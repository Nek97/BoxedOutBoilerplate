// @ts-nocheck
/* istanbul ignore file */

import Faker from 'faker';
import { User } from '../entities/user.entity';
import { define } from 'typeorm-seeding';
import {
  DEF_FAKER_MAX_RETRIES,
  FakerHelper,
} from '@nestjs-yalc/utils/faker-helper';
import { staticKey } from '@nestjs-yalc/aws-helpers';
import { encryptAes } from '@nestjs-yalc/utils/encryption.helper';

const fakerHelper = new FakerHelper();
export const fakeBoolean = (faker: typeof Faker) => faker.datatype.number(1);

export const userFactory = (faker: typeof Faker) => {
  const person = fakerHelper.createPerson();

  const user = new User();
  user.guid = faker.datatype.uuid();
  user.firstName = person.firstName;
  user.lastName = person.lastName;
  user.country = faker.address.countryCode();
  user.language = faker.address.countryCode();
  user.twoFactor = fakeBoolean(faker);
  if (user.twoFactor === 1) {
    user.twoFactorKey = encryptAes(faker.random.alphaNumeric(40), staticKey);
  }

  // Taking easy road here, actually we can get 000 001 as well, but to avoid padding we start at 100 000
  // Does not actually matter for handling of the data.
  user.twoFactorLatest = faker.datatype
    .number({
      min: 100000,
      max: 999999,
    })
    .toString();

  // antiPhishing is a random string assigned by client, but should be abstracted from showing.
  if (fakeBoolean(faker)) {
    user.antiPhishing = faker.random.alphaNumeric(6);
  }
  user.bankKey = faker.unique(faker.random.alphaNumeric, [6], {
    maxRetries: DEF_FAKER_MAX_RETRIES,
  });
  user.affiliate = fakeBoolean(faker) === 1 ? faker.random.alphaNumeric(6) : '';
  user.affiliateLink = faker.unique(faker.random.alphaNumeric, [6], {
    maxRetries: DEF_FAKER_MAX_RETRIES,
  });
  user.affiliateCount = faker.datatype.number(10);
  user.overrideCooldown = fakeBoolean(faker);
  user.trustpilot = fakeBoolean(faker);
  user.rebateNewUser = faker.datatype.number(2);
  user.rebateAmount = fakerHelper.randomDecimal(0, 2.5, 0.01);
  user.rebateValidUntil =
    fakeBoolean(faker) === 1 ? faker.date.future() : faker.date.past(3);
  user.unsubscribeToken = ''; // not used in V2
  user.videoVerificationRequest =
    fakeBoolean(faker) === 1 ? faker.date.future() : faker.date.past(3);
  user.proofOfFundsDeadline =
    fakeBoolean(faker) === 1 ? faker.date.future() : faker.date.past(3);
  user.feeVolume = fakerHelper.randomDecimal(0, 100000, 0.01);
  user.settingsNotifyIncorrectLogin = fakeBoolean(faker);
  user.settingsNotifyDeposit = fakeBoolean(faker);
  user.settingsNotifyWithdrawal = fakeBoolean(faker);
  user.settingsNotifyDistribution = fakeBoolean(faker);
  user.settingsAcceptTransfers = fakeBoolean(faker);
  user.accountDeleted = fakeBoolean(faker);
  user.videoVerificationPassed = fakeBoolean(faker);

  // Locks can be in the past (lifted locks) or in the future (locked till then) or null (no locks)
  user.boxedoutLock = fakerHelper.randomLockDate();
  user.userLock = fakerHelper.randomLockDate();
  user.withdrawalLock = fakerHelper.randomLockDate();
  user.tradingLock = fakerHelper.randomLockDate();
  user.euroInLock = fakerHelper.randomLockDate();
  user.euroOutLock = fakerHelper.randomLockDate();
  user.cryptoInLock = fakerHelper.randomLockDate();
  user.cryptoOutLock = fakerHelper.randomLockDate();

  user.limitDailyWithdrawal = faker.random.arrayElement([
    25000, 50000, 100000, 500000, 1000000,
  ]);

  user.proofOfFundsNewRequest = faker.random.arrayElement([
    100000, 500000, 1000000,
  ]);

  user.proofOfFundsEmergencyBrake = 0; // static 0 for now, almost no one has this

  // Either the user still has time for his deadline, or has passed it (@Tim can be null as well?)
  user.idVerifyDeadline =
    fakeBoolean(faker) === 1 ? faker.date.future() : faker.date.past(3);
  user.addressbookEnabled = fakeBoolean(faker);

  user.feeTier = faker.datatype.number(8);
  user.feeTakerBps = feeTiers[user.feeTier].taker;
  user.feeMakerBps = feeTiers[user.feeTier].maker;

  // -1 is not set, 0 is off, 1 is on
  user.settingsNewsletter = faker.datatype.number({ min: -1, max: 1 });
  return user;
};

const feeTiers = [
  { taker: '25.0', maker: '15.0' },
  { taker: '20.0', maker: '10.0' },
  { taker: '16.0', maker: '8.0' },
  { taker: '12.0', maker: '6.0' },
  { taker: '10.0', maker: '4.0' },
  { taker: '8.0', maker: '2.0' },
  { taker: '6.0', maker: '1.0' },
  { taker: '5.0', maker: '0.0' },
  { taker: '4.0', maker: '-1.0' },
];

define(User, userFactory);
