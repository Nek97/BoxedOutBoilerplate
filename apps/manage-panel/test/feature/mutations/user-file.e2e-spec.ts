/* istanbul ignore file */

import { ManagePanelModule } from '@boxedout-app/manage-panel/manage-panel.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import {
  getTestFilename,
  initApp,
  runQuery,
} from '../../../../../libs/boxedout-libs/shared/src/jest/jest.helper';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';
import { testingEntry } from '@boxedout-libs/shared/seeder-helper';

const fixedGuid = testingEntry.guid;

describe(`mutations/${getTestFilename(__filename)} : userFile Test`, () => {
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

  it('should delete a file', async () => {
    const query_ManageUser_getUserFileGrid = `query {
      ManageUser_getUserFileGrid(
      startRow: 0
      endRow: 20
      sorting: [ { colId: ID, sort: ASC } ]
      userId:"${fixedGuid}"
      ) {
      nodes{
      ID
      referenceId
      guid
      category
      type
      filePath
      timestamp
      userId
      }
      }
      }`;
    let gridData = {};
    await runQuery({
      app,
      loginApp,
      query: query_ManageUser_getUserFileGrid,
      queryName: 'ManageUser_getUserFileGrid',
      role: RoleEnum.AGENT,
      callback: (body) => {
        const returnedData = body.data?.ManageUser_getUserFileGrid;
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(returnedData).toBeDefined();
        expect(error).not.toBeDefined();
        gridData = returnedData.nodes;
      },
    });

    await runQuery({
      app,
      loginApp,
      query: `mutation{
        ManageUser_deleteUserFile(conditions:{ID:${gridData[0].ID}})
      }`,
      queryName: 'ManageUser_deleteUserFile',
      role: RoleEnum.AGENT,
      callback: (body) => {
        const returnedData = body.data?.ManageUser_deleteUserFile;
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(returnedData).toBeTruthy();
        expect(error).not.toBeDefined();
        gridData = returnedData.nodes;
      },
    });

    await runQuery({
      app,
      loginApp,
      query: query_ManageUser_getUserFileGrid,
      queryName: 'ManageUser_getUserFileGrid',
      role: RoleEnum.AGENT,
      callback: (body) => {
        const returnedData = body.data?.ManageUser_getUserFileGrid;
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(returnedData).not.toEqual(gridData);
        expect(error).not.toBeDefined();
      },
    });
  });
});
