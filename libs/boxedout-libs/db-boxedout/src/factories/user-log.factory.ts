// @ts-nocheck
/* istanbul ignore file */

import Faker from 'faker';
import { UserLog } from '../entities/user-log.entity';
import { define } from 'typeorm-seeding';

const types = [
  { type: 'account_created' },
  { type: 'account_delete_request' },
  { type: 'account_deleted' },
  { type: 'account_deleted_admin' },
  { type: 'add_addressbook' },
  { type: 'add_api_key' },
  {
    type: 'add_device',
    data: { deviceToken: 'eee07aaaa35f2cf56c69145c59423c3ef90396a2' },
  },
  {
    type: 'add_device_success',
    data: {
      deviceName: 'iPhone Tim',
      deviceToken: 'eee07aaaa35f2cf56c69145c59423c3ef90396a2',
    },
  },
  {
    type: 'add_mobile_device',
    data: { deviceToken: 'eee07aaaa35f2cf56c69145c59423c3ef90396a2' },
  },
  {
    type: 'add_mobile_device_success',
    data: {
      deviceName: 'App',
      deviceToken: 'eee07aaaa35f2cf56c69145c59423c3ef90396a2',
      type: 'mobile',
    },
  },
  {
    type: 'add_whitelist',
    data: {
      currency: 'XRP',
      address: 'rpKyPAGDQosd4EEtDzwYEi887JWqtfmw4j',
      paymentId: 'exodus wallet',
    },
  },
  {
    type: 'api_key_confirm',
    data: {
      key: 'aaaaaaab5d3d1d31f6d4be500a0e4f9bebe12d16a31fb308b0f2c5f49e2d720e',
    },
  },
  { type: 'bank_account_approved', data: { bank: 'NL58INGB12345678' } },
  { type: 'bank_account_rejected', data: { bank: 'NL58INGB12345678' } },
  { type: 'delete_api_key' },
  { type: 'delete_dust' },
  {
    type: 'delete_whitelist',
    data: {
      currency: 'XRP',
      address: 'rpKyPAGDQosd4EEtDzwYEi887JWqtfmw4j',
      paymentId: 'test exodus',
    },
  },
  { type: 'edit_api_key' },
  { type: 'email_change', data: { email: 'email@domain.com' } },
  { type: 'email_resend' },
  { type: 'email_verified', data: { email: 'email@domain.com' } },
  { type: 'id_approved' },
  { type: 'id_rejected' },
  { type: 'id_upload' },
  { type: 'login_failed' },
  { type: 'login_mobile_failed' },
  { type: 'login_mobile_success' },
  { type: 'login_success' },
  { type: 'password_changed' },
  {
    type: 'password_reset',
    data: { token: 'aaa11321234dd0af2a83bbc89547a220d818a44e', used: 0 },
  },
  { type: 'password_reset_confirmed' },
  { type: 'phone_verified', data: { phone: '+31 6 12345678' } },
  { type: 'phone_verify', data: { phone: '+31 6 12345678' } },
  { type: 'proof_of_funds_submitted' },
  { type: 'questionnaire_answered' },
  {
    type: 'remove_device_success',
    data: { deviceToken: 'eee07aaaa35f2cf56c69145c59423c3ef90396a2' },
  },
  { type: 'two_factor_enabled' },
  { type: 'two_factor_disabled' },
  { type: 'two_factor_login_failed' },
  { type: 'two_factor_login_mobile_failed' },
  { type: 'two_factor_reset' },
  {
    type: 'two_factor_reset_confirmed',
    data: {
      emailToken: 'aadb1cdc7477c6eefff935f59724a403c8700481',
      smsToken: '1E73A9',
      used: 0,
    },
  },
  {
    type: 'whitelist_confirm',
    data: {
      currency: 'XRP',
      address: 'rpKyPAGDQosd4EEtDzwYEi887JWqtfmw4j',
      paymentId: 'exodus wallet',
    },
  },
  {
    type: 'withdrawal_confirm',
    data: {
      token: 'd4d61df4f400162bac8f7dfd83a3dff352caabeb',
      currency: 'NEO',
    },
  },
  {
    type: 'withdrawal_request',
    data: { token: 'd3e801792d96ef7885e8df88cd2c2009c8ff8d1b' },
  },
];

export const userLogFactory = (faker: typeof Faker) => {
  const typeData = faker.random.arrayElement(types);
  const data = new UserLog();
  data.guid = faker.datatype.uuid();
  data.timestamp = faker.date.past(3);
  data.ip = faker.internet.ip();
  data.userAgent = faker.internet.userAgent();
  data.type = typeData.type;
  data.device = faker.random.alphaNumeric(40);
  data.data = JSON.stringify(typeData.data) ?? '{}';
  return data;
};

define(UserLog, userLogFactory);
