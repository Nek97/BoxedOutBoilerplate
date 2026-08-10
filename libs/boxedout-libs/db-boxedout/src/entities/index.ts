// @ts-nocheck
/* istanbul ignore file */

import { UserIdentityGlobal } from '@boxedout-libs/db-boxedoutAdmin/entities/user-identity.entity';
import { ClassType } from '@nestjs-yalc/types';
import { ActiveSession } from './active-session.entity';
import { AdminLog } from './admin-log.entity';
import { AdminLogTypeEnum } from './admin-log.enum';
import { UserDevice } from './user-device.entity';
import { UserEmail } from './user-email.entity';
import { UserLog, UserLogGlobal } from './user-log.entity';
import { UserMobileDevice } from './user-mobile-device.entity';
import { UserPhone } from './user-phone.entity';
import { UserPhoneStatusEnum } from './user-phone.enum';
import { User, UserGlobal } from './user.entity';
import { UserFile } from './user-file.entity';
import { UserAddress } from './user-address.entity';

export const EntityList: () => ClassType[] = () => [
  ActiveSession,
  AdminLog,
  UserAddress,
  UserDevice,
  UserLog,
  UserMobileDevice,
  UserPhone,
  User,
  UserEmail,
  UserFile,
];

export {
  ActiveSession,
  AdminLog,
  UserAddress,
  UserDevice,
  UserLog,
  UserMobileDevice,
  UserPhone,
  User,
  UserEmail,
  UserFile,
};

export const EntityGlobalList: () => ClassType[] = () => [
  UserGlobal,
  UserIdentityGlobal,
  UserLogGlobal,
];

export {
  UserGlobal,
  UserIdentityGlobal,
  UserLogGlobal,
};

export const EntityEnumList = [
  AdminLogTypeEnum,
  UserPhoneStatusEnum,
];
export {
  AdminLogTypeEnum,
  UserPhoneStatusEnum,
};

export * from './market-tick.entity';
