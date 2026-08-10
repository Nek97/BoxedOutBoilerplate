// @ts-nocheck
/* istanbul ignore file */

import { buildDbConfigObject } from '@nestjs-yalc/database/db-config-object.helper';
import { IDbConfObject } from '@nestjs-yalc/database/conf.interface';
import { DBNames } from '../db-default.conf';
import * as BoxedOut from '@boxedout-libs/db-boxedout';
import * as BoxedOutAdmin from '@boxedout-libs/db-boxedoutAdmin';
import * as FraudPrevention from '@boxedout-libs/db-fraudPrevention/entities';
import {
  DepositBTC,
  DepositXLM,
  DepositXRP,
} from '@boxedout-libs/db-crypto/entities/deposit.entity';
import * as Eur from '@boxedout-libs/db-eur/entities';
import { getCryptoWithdrawalMap } from '@boxedout-libs/db-crypto/entities/withdrawal.entity';

export const databaseDir = `${__dirname}/../database`;
export const sourceDir = `${__dirname}/../`;
export const migrationsDir = `${databaseDir}/migrations`;

export const dbBoxedOutGlobal = (connectionName?: string): IDbConfObject => {
  return buildDbConfigObject({
    dbName: undefined,
    connectionName: connectionName ?? DBNames.BOXEDOUT_GLOBAL,
    entities: [
      ...BoxedOut.EntityList(),
      ...BoxedOutAdmin.EntityList(),
      ...FraudPrevention.EntityList(),
      ...Eur.EntityList(),

      DepositBTC,
      DepositXLM,
      DepositXRP,
      ...Object.values(getCryptoWithdrawalMap()),
      ...BoxedOut.EntityGlobalList(),
      ...BoxedOutAdmin.EntityGlobalList(),
      ...FraudPrevention.EntityGlobalList(),
      ...Eur.EntityGlobalList(),
    ],
  });
};
