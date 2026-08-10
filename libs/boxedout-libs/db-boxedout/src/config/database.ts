// @ts-nocheck
/* istanbul ignore file */

import { buildDbConfigObject } from '@nestjs-yalc/database/db-config-object.helper';
import { DBNames } from '@boxedout-libs/shared/db-default.conf';
import { IDbConfObject } from '@nestjs-yalc/database/conf.interface';
import * as BoxedOut from '../index';

// we need to import all the migrations here to be compiled with TSC
import '../database/migrations';
import { envIsTrue } from '@nestjs-yalc/utils/env.helper';

export const databaseDir = `${__dirname}/../database`;
export const sourceDir = `${__dirname}/../`;
export const migrationsDir = `${databaseDir}/migrations`;

let extraMigrationDirs: string[] | undefined = undefined;
if (envIsTrue(process.env.TYPEORM_CUSTOM_DEV_MIGRATIONS)) {
  extraMigrationDirs = [`${databaseDir}/seeds/dev-migrations/**/*.{ts,js}`];
}

export const dbBoxedOut = (
  /** The connectionName. if not specified, dbName will be used instead */
  connectionName?: string,
): IDbConfObject => {
  return buildDbConfigObject({
    dbName: DBNames.BOXEDOUT,
    connectionName,
    entities: BoxedOut.EntityList(),
    seeds: BoxedOut.SeedList,
    sourceDir,
    migrationsDir,
    extraMigrationDirs,
  });
};
