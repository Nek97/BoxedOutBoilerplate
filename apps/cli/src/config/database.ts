/* istanbul ignore file */

import { dbBoxedOut } from '@boxedout-libs/db-boxedout/config/database';
import { dbBoxedOutAdmin } from '@boxedout-libs/db-boxedoutAdmin/config/database';
import {
  IDbConfObject,
  IDbConfType,
} from '@nestjs-yalc/database/conf.interface';
import { getConfNameByConnection } from '@nestjs-yalc/database/conn.helper';
import { registerAs } from '@nestjs/config';
import { getConnectionToken } from '@nestjs/typeorm';
import { dbBoxedOutGlobal } from '@boxedout-libs/shared/config/database';

/**
 * The order of the list is important for the seeding
 */
export const dbConf: IDbConfObject[] = [
  dbBoxedOut(),
  dbBoxedOutGlobal(),
  dbBoxedOutAdmin(),
];

export const injectDbConnections = dbConf.map((k) =>
  getConnectionToken(k.connName),
);

export const regDbConf = dbConf.map((fn) => {
  return registerAs(
    getConfNameByConnection(fn.connName),
    (): IDbConfType => fn(),
  );
});
