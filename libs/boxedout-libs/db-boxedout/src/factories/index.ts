// @ts-nocheck
/* istanbul ignore file */

import { addressbookFactory } from './addressbook.factory';
import { adminLogFactory } from './admin-log.factory';
import { userAddressFactory } from './user-address.factory';
import { userDeviceFactory } from './user-device.factory';
import { userEmailFactory } from './user-email.factory';
import { userFileFactory } from './user-file.factory';
import { userIdentityDocumentFactory } from './user-identity-document.factory';
import { userLogFactory } from './user-log.factory';
import { userMobileDeviceFactory } from './user-mobile-device.factory';
import { userPhoneFactory } from './user-phone.factory';
import { userProofOfFundsFactory } from './user-proof-of-funds.factory';
import { userQuestionnaireFactory } from './user-questionnaire.factory';
import { userFactory } from './user.factory';

export const FactoryList = [
  addressbookFactory,
  adminLogFactory,
  userDeviceFactory,
  userEmailFactory,
  userIdentityDocumentFactory,
  userLogFactory,
  userMobileDeviceFactory,
  userPhoneFactory,
  userProofOfFundsFactory,
  userQuestionnaireFactory,
  userFactory,
  userFileFactory,
  userAddressFactory,
];

export {
  addressbookFactory,
  adminLogFactory,
  userDeviceFactory,
  userEmailFactory,
  userIdentityDocumentFactory,
  userLogFactory,
  userMobileDeviceFactory,
  userPhoneFactory,
  userProofOfFundsFactory,
  userQuestionnaireFactory,
  userFactory,
  userFileFactory,
  userAddressFactory,
};
