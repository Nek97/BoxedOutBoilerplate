// @ts-nocheck
/* istanbul ignore file */

import { buildDbConfigObject } from '@nestjs-yalc/database/db-config-object.helper';
import { IDbConfObject } from '@nestjs-yalc/database/conf.interface';
import { DBNames } from '@boxedout-libs/shared/db-default.conf';
import * as BoxedOutAdmin from '../index';

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

export const dbBoxedOutAdmin = (
  /** The connectionName. if not specified, dbName will be used instead */
  connectionName?: string,
): IDbConfObject => {
  return buildDbConfigObject({
    dbName: DBNames.BOXEDOUT_ADMIN,
    connectionName,
    entities: BoxedOutAdmin.EntityList(),
    seeds: BoxedOutAdmin.SeedList,
    sourceDir,
    migrationsDir,
    extraMigrationDirs,
  });
};
