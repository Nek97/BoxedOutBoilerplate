/* istanbul ignore file */

import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import {
  getTestFilename,
  initApp,
  runQuery,
} from '@boxedout-libs/shared/jest/jest.helper';
import { SUPERUSER_GUID } from '@boxedout-libs/shared/seeder-helper';
import { ManagePanelModule } from '@boxedout-app/manage-panel/manage-panel.module';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';

describe(`queries/${getTestFilename(
  __filename,
)} : Log Action Resolver Test`, () => {
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

  it('Get result for ManageMonitor_getLogActionGrid', async () => {
    const queryName = `ManageMonitor_getLogActionGrid`;
    const query = `
    query{
      ${queryName}(
        startRow: 0
        endRow: 20
        sorting: [ { colId: "adminId", sort: ASC } ]
        filters: "{\\"adminId\\":{\\"filterType\\":\\"text\\",\\"type\\":\\"equal\\",\\"filter\\":\\"${SUPERUSER_GUID}\\"}}"
        ) {
            nodes{
              adminId
              userId
              timestamp
              ip
              device
              type
              data
              User {
                ID
              }
            }
        }
    }
    `;

    await runQuery({
      app,
      loginApp,
      query,
      queryName,
      role: RoleEnum.SHIFT_LEAD,
    });
  });

  it('Get result for ManageMonitor_getLogActionGridSelf', async () => {
    const queryName = `ManageMonitor_getLogActionGridSelf`;
    const query = `
    query{
      ${queryName}(
        startRow: 0
        endRow: 20
        sorting: [ { colId: "adminId", sort: ASC } ]
        ) {
            nodes{
              adminId
              userId
              timestamp
              ip
              device
              type
              data
              User {
                ID
              }
            }
        }
    }
    `;

    await runQuery({
      app,
      loginApp,
      query,
      queryName,
      role: RoleEnum.SUPER_USER,
    });
  });
});
