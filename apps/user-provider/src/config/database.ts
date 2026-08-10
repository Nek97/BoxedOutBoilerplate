// @ts-nocheck
/* istanbul ignore file */

import { registerAs } from '@nestjs/config';
import { dbBoxedOut } from '@boxedout-libs/db-boxedout/config/database';
import { dbBoxedOutAdmin } from '@boxedout-libs/db-boxedoutAdmin/config/database';
import { dbRoot } from '@boxedout-libs/db-boxedoutSys/config/database';
import {
  IDbConfObject,
  IDbConfType,
} from '@nestjs-yalc/database/conf.interface';
import { getConfNameByConnection } from '@nestjs-yalc/database/conn.helper';
import { getConnectionToken } from '@nestjs/typeorm';
import { dbBoxedOutGlobal } from '@boxedout-libs/shared/config/database';
import { DBNames } from '@boxedout-libs/shared/db-default.conf';
import { dbEmail } from '@boxedout-libs/db-email/config/database';

export const dbConf: IDbConfObject[] = [
  dbRoot(),
  dbBoxedOut(),
  dbBoxedOutAdmin(),
  dbBoxedOutGlobal(),
  dbEmail(),
];

export const getDbConf = (onlyAuth = false): IDbConfObject[] => {
  if (!onlyAuth) {
    return dbConf;
  } else {
    return [
      dbRoot(`userprovider_${DBNames.BOXEDOUT_SYS}`),
      dbBoxedOut(`userprovider_${DBNames.BOXEDOUT}`),
      dbBoxedOutAdmin(`userprovider_${DBNames.BOXEDOUT_ADMIN}`),
    ];
  }
};

export const injectDbConnections = (onlyAuth = false) =>
  getDbConf(onlyAuth).map((k) => getConnectionToken(k.connName));

export const regDbConf = (onlyAuth = false) =>
  getDbConf(onlyAuth).map((fn) => {
    return registerAs(
      getConfNameByConnection(fn.connName),
      (): IDbConfType => fn(),
    );
  });
