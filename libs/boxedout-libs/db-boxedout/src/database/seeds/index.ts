// @ts-nocheck
/* istanbul ignore file */

// DEV migrations
import './dev-migrations/9000000000000-devCreateUsers';

import CreateAddressbook from './create-addressbook';
import CreateAdminLog from './create-admin-log';
import CreateUsers from './create-user';
import CreateUserDevice from './create-user-device';
import CreateUserEmail from './create-user-email';
import CreateUserFile from './create-user-file';
import CreateUserId from './create-user-identity-document';
import CreateUserLog from './create-user-log';
import CreateUserMobileDevice from './create-user-mobile-device';
import CreateUserPhone from './create-user-phone';
import CreateUserProofOfFunds from './create-user-proof-of-funds';
import CreateUserQuestionnaire from './create-user-questionnaire';
import CreateUserAddress from './create-user-address';

export const SeedList = [
  CreateAddressbook,
  CreateAdminLog,
  CreateUserDevice,
  CreateUserEmail,
  CreateUserId,
  CreateUserLog,
  CreateUserMobileDevice,
  CreateUserPhone,
  CreateUserProofOfFunds,
  CreateUserQuestionnaire,
  CreateUsers,
  CreateUserFile,
  CreateUserAddress,
];

export {
  CreateAddressbook,
  CreateAdminLog,
  CreateUserDevice,
  CreateUserEmail,
  CreateUserId,
  CreateUserLog,
  CreateUserMobileDevice,
  CreateUserPhone,
  CreateUserProofOfFunds,
  CreateUserQuestionnaire,
  CreateUsers,
  CreateUserFile,
  CreateUserAddress,
};
