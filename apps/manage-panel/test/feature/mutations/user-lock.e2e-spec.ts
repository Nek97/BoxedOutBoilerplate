/* istanbul ignore file */

import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  getTestFilename,
  initApp,
  runQuery,
} from '../../../../../libs/boxedout-libs/shared/src/jest/jest.helper';
import { testingEntry } from '@boxedout-libs/shared/seeder-helper';
import { ManagePanelModule } from '@boxedout-app/manage-panel/manage-panel.module';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';
import { VerificationStatus } from '@boxedout-libs/shared/enum/verification-status.enum';
import { getConnection } from 'typeorm';
import { DbConnection } from '@boxedout-libs/shared/db-default.conf';
import { UserTagEnum } from '@boxedout-libs/db-boxedoutAdmin/entities/user-tag.enum';
import { CommentTagEnum } from '@boxedout-libs/db-boxedoutAdmin/entities/comment.enum';
import {
  LockActionEnum,
  UserLockTypeEnum,
} from '@boxedout-libs/db-boxedout/entities/user.enum';

const fixedGuid = testingEntry.guid;

describe(`mutation/${getTestFilename(__filename)} : user lock test`, () => {
  let app: NestFastifyApplication;
  let loginApp: NestFastifyApplication;

  beforeAll(async () => {
    loginApp = await initApp(UserProviderModule.forRoot({ onlyAuth: true }));
    app = await initApp(ManagePanelModule.forRoot());
  });

  afterAll(async () => {
    loginApp && (await loginApp.close());
    app && (await app.close());
  });

  it('Should lock a user + tag + comment', async () => {
    const queryName = 'ManageMonitor_lockAccount';
    const query = `
    mutation ManageMonitor_lockAccount($input: UserLockInputType!) {
      ManageMonitor_lockAccount(input: $input) {
        ID
        cryptoInLock
        cryptoOutLock
        euroInLock
      }
    }
    `;
    await runQuery({
      app,
      loginApp,
      query: query,
      queryName: queryName,
      variables: {
        input: {
          guid: fixedGuid,
          lockType: UserLockTypeEnum.MULTIPLE_ACCOUNT_LOCK.toUpperCase(),
        },
      },
      role: RoleEnum.COMPLIANCE_LOCK,
      callback: (body) => {
        const returnedData = body.data?.[queryName];
        const error = body.errors?.length ? body.errors[0].message : undefined;
        expect(returnedData?.nodes).not.toBeDefined();
        console.log(returnedData);
        const { cryptoInLock, cryptoOutLock, euroInLock } = returnedData;
        const date = new Date();
        date.setFullYear(date.getFullYear() + 9);
        expect(new Date(cryptoInLock) >= date).toBeTruthy();
        expect(new Date(cryptoOutLock) >= date).toBeTruthy();
        expect(new Date(euroInLock) >= date).toBeTruthy();
      },
    });

    /**
     * POST CHECK
     */
    const connection = getConnection(DbConnection.BOXEDOUT_GLOBAL);
    const queryRunner = connection.createQueryRunner();
    const comment = await queryRunner.query(
      `SELECT * FROM boxedoutAdmin.comments WHERE targetGuid=? AND message LIKE "%${CommentTagEnum.ENABLE_LOCKS}%"`,
      [fixedGuid],
    );
    expect(comment[0]).toBeDefined();

    const tag = await queryRunner.query(
      'SELECT * FROM boxedoutAdmin.userTags WHERE guid = ? AND tag = ?',
      [fixedGuid, UserTagEnum.MULTIPLE_ACCOUNT_LOCK],
    );
    expect(tag[0]).toBeDefined();
  });

  it('Should unlock a user + tag + comment', async () => {
    const queryName = 'ManageMonitor_unlockAccount';
    const query = `
    mutation ManageMonitor_unlockAccount($input: UserLockInputType!){
      ManageMonitor_unlockAccount(input: $input){
        ID
        cryptoInLock
        cryptoOutLock
        euroInLock
      }
    }
    `;
    await runQuery({
      app,
      loginApp,
      query: query,
      queryName: queryName,
      variables: {
        input: {
          guid: fixedGuid,
          lockType: UserLockTypeEnum.MULTIPLE_ACCOUNT_LOCK.toUpperCase(),
        },
      },
      role: RoleEnum.COMPLIANCE_LOCK,
      callback: (body) => {
        const returnedData = body.data?.[queryName];
        const error = body.errors?.length ? body.errors[0].message : undefined;
        expect(returnedData?.nodes).not.toBeDefined();

        const { cryptoInLock, cryptoOutLock, euroInLock } = returnedData;
        expect(new Date(cryptoInLock).getTime()).toBeLessThan(
          new Date().getTime(),
        );
        expect(new Date(cryptoOutLock).getTime()).toBeLessThan(
          new Date().getTime(),
        );
        expect(new Date(euroInLock).getTime()).toBeLessThan(
          new Date().getTime(),
        );
      },
    });

    /**
     * POST CHECK
     */
    const connection = getConnection(DbConnection.BOXEDOUT_GLOBAL);
    const queryRunner = connection.createQueryRunner();
    const comment = await queryRunner.query(
      `SELECT * FROM boxedoutAdmin.comments WHERE targetGuid=? AND message LIKE "%${CommentTagEnum.DISABLE_LOCKS}%"`,
      [fixedGuid],
    );
    expect(comment[0]).toBeDefined();

    const tag = await queryRunner.query(
      'SELECT * FROM boxedoutAdmin.userTags WHERE guid = ? AND tag = ?',
      [fixedGuid, UserTagEnum.MULTIPLE_ACCOUNT_LOCK],
    );
    expect(tag.length).toEqual(0);
  });

  it('Should lock a list of user', async () => {
    const connection = getConnection(DbConnection.BOXEDOUT_GLOBAL);
    const queryRunner = connection.createQueryRunner();
    const guidList = (
      await queryRunner.query('SELECT guid FROM boxedout.userList LIMIT 3')
    ).map((el) => el.guid);
    const queryName = 'ManageMonitor_handleLockBulk';
    const query = `
    mutation ManageMonitor_handleLockBulk($input: UserLockBulkInputType!){
      ManageMonitor_handleLockBulk(
        input: $input
      ){
        status
        error
        guid
    }
    }
    `;
    await runQuery({
      app,
      loginApp,
      query: query,
      queryName: queryName,
      variables: {
        input: {
          guidList: guidList,
          lockType: UserLockTypeEnum.MULTIPLE_ACCOUNT_LOCK.toUpperCase(),
          action: LockActionEnum.LOCK.toUpperCase(),
        },
      },
      role: RoleEnum.COMPLIANCE_LOCK,
      callback: (body) => {
        const returnedData = body.data?.[queryName];

        expect(returnedData?.nodes).not.toBeDefined();

        returnedData.forEach((data) => {
          expect(data.status).toBeTruthy();
          expect(data.status).toBeTruthy();
          expect(data.status).toBeTruthy();
        });
      },
    });
  });
});
