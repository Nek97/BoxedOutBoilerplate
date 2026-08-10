/* istanbul ignore file */

import { registerAs } from '@nestjs/config';
import { dbBoxedOutAdmin } from '@boxedout-libs/db-boxedoutAdmin/config/database';
import { dbBoxedOut } from '@boxedout-libs/db-boxedout/config/database';

import {
  IDbConfObject,
  IDbConfType,
} from '@nestjs-yalc/database/conf.interface';
import { getConfNameByConnection } from '@nestjs-yalc/database/conn.helper';
import { getConnectionToken } from '@nestjs/typeorm';

export const dbConf: IDbConfObject[] = [
  dbBoxedOutAdmin(),
  dbBoxedOut(),
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
