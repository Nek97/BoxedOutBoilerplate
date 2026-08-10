// @ts-nocheck
/* istanbul ignore file */

import { registerAs } from '@nestjs/config';
import { dbBoxedOut } from '@boxedout-libs/db-boxedout/config/database';
import { dbBoxedOutAdmin } from '@boxedout-libs/db-boxedoutAdmin/config/database';
import {
  IDbConfObject,
  IDbConfType,
} from '@nestjs-yalc/database/conf.interface';
import { getConfNameByConnection } from '@nestjs-yalc/database/conn.helper';
import { getConnectionToken } from '@nestjs/typeorm';
import { dbBoxedOutGlobal } from '@boxedout-libs/shared/config/database';
import { CryptoAssetsEnum } from '@boxedout-libs/shared/asset.enum';
import { buildDbConfigObject } from '@nestjs-yalc/database/db-config-object.helper';
import { SkeletonPhone, SkeletonUser } from '@nestjs-yalc/skeleton-module';
import { SkeletonBoxedOutUser } from '@boxedout/skeleton-boxedout-module';

export const dbConf: IDbConfObject[] = [
  dbBoxedOut(),
  dbBoxedOutAdmin(),
  dbBoxedOutGlobal(),
];

if (process.env.NODE_ENV === 'development' && !process.env.JEST_WORKER_ID) {
  dbConf.push(
    buildDbConfigObject({
      dbName: 'boxedout',
      connectionName: 'boxedoutSkeleton',
      entities: [SkeletonBoxedOutUser, SkeletonPhone, SkeletonUser],
      synchronize: true,
    }),
  );
}

export const injectDbConnections = dbConf.map((k) =>
  getConnectionToken(k.connName),
);

export const regDbConf = dbConf.map((fn) => {
  return registerAs(
    getConfNameByConnection(fn.connName),
    (): IDbConfType => fn(),
  );
});
