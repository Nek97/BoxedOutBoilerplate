/* istanbul ignore file */

import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import {
  getTestFilename,
  initApp,
  runQuery,
} from '@boxedout-libs/shared/jest/jest.helper';
import { GqlErrorMsgs } from '@nestjs-yalc/graphql/plugins/gql.error';
import { ManagePanelModule } from '@boxedout-app/manage-panel/manage-panel.module';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';

describe(`queries/${getTestFilename(
  __filename,
)} : Test dataloader resources`, () => {
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

  it('Get result for ManageUser_getUserGrid', async () => {
    const queryName = `ManageUser_getUserGrid`;
    const query = `
    query{
      ManageUser_getUserGrid(startRow: 0
    endRow: 25
    sorting: [ { colId: "ID", sort: ASC } ]
    filters: "{}"
    ){
        nodes{
          country
          firstName
          lastName
          language
          UserTag {
            pageData {
              count
            }
            nodes {
              userId
            }
          }
					NotFilteredUserLogs:UserLog{
            nodes {
              timestamp
            }
          }
          FilteredUserLog:UserLog(
            startRow:1
            endRow:100
            filters: "{\\"userId\\":{\\"filterType\\":\\"text\\",\\"type\\":\\"contains\\",\\"filter\\":\\"a\\"}}"
          ) {
            nodes{
              timestamp
              userId
              type
            }
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
      role: RoleEnum.MANAGEMENT,
      callback: (body) => {
        /**
         * We want to also check if at least 1 result is retrieved
         * @todo we should add better values than > 0
         */
        const userNodes = body.data?.[queryName].nodes;
        const userAmount = userNodes.length;
        expect(userAmount).toBeGreaterThan(0);

        for (const userNode of userNodes) {
          const userLogsNodes = userNode.NotFilteredUserLogs.nodes;
          const userLogsAmount = userLogsNodes.length;
          expect(userLogsAmount).toBeGreaterThan(0);

          const userTagsNodes = userNode.UserTag.nodes;
          const userTagsAmount = userTagsNodes.length;
          expect(userTagsAmount).toBeGreaterThan(0);
        }
      },
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
              User {
                ID
                affiliatePct
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
      callback: (body) => {
        const amount = body.data?.[queryName].nodes.length;
        expect(amount).toBeGreaterThan(0);
      },
    });
  });

  it('Should throw circular dependency error', async () => {
    const queryName = `ManageUser_getUserGrid`;
    const query = `
    query{
      ManageUser_getUserGrid(
        startRow: 0
        endRow: 20
        ) {
          nodes {
            UserTag {
              nodes {
                UserDynamic {
                  UserTag {
                    userId
                  }
                }
              }
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
      skipExpect: true,
      callback: (body) => {
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(error).toBe(GqlErrorMsgs.CIRCULAR_DEPENDENCY_FOUND);
      },
      statusCode: 400,
    });
  });

  it('Should return non paginated dataloaders', async () => {
    const queryName = `ManageMonitor_getLogViewGrid`;
    const query = `query {
      ManageMonitor_getLogViewGrid {
        nodes {
          adminId
          userId
          type
          User {
            ID
            antiPhishing
          }
          Admin {
            ID
            antiPhishing
          }
        }
      }
    }`;

    await runQuery({
      app,
      loginApp,
      query,
      queryName,
      role: RoleEnum.SHIFT_LEAD,
      callback: (body) => {
        /**
         * We want to also check if at least 1 result is retrieved
         * @todo we should add better values than > 0
         */
        const userNodes = body.data?.[queryName].nodes;
        const userAmount = userNodes.length;
        expect(userAmount).toBeGreaterThan(0);

        for (const userNode of userNodes) {
          const nestedUser = userNode.User;
          expect(nestedUser).toBeDefined();
          //expect(nestedUser.ID).toBeDefined();

          const nestedAdmin = userNode.Admin;
          expect(nestedAdmin).toBeDefined();
        }
      },
    });
  });

  it('Should throw max depth allowed', async () => {
    const queryName = `ManageUser_getUserGrid`;
    const query = `
      query{
        ManageUser_getUserGrid(
          startRow: 0
          endRow: 20
          ) {
          nodes{
            UserDynamic {
              nodes {
                User {
                  Comment{
                    nodes{
                      Admin{
                        UserIdentityDocument{
                          nodes{
                            ID
                          }
                        }
                      }
                    }
                  }
                }
              }
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
      skipExpect: true,
      callback: (body) => {
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(error).toBe(GqlErrorMsgs.MAX_DEPTH);
      },
      statusCode: 400,
    });
  });
});
