/* istanbul ignore file */

import * as request from 'supertest';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import {
  getFiltersSoft,
  getJWT,
  getTestFilename,
  initApp,
  runQuery,
} from '@boxedout-libs/shared/jest/jest.helper';
import { GeneralFilters } from '@nestjs-yalc/ag-grid/ag-grid.enum';
import { SUPERUSER_GUID } from '@boxedout-libs/shared/seeder-helper';
import { ManagePanelModule } from '@boxedout-app/manage-panel/manage-panel.module';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';
import { AssetCodeEnum } from '@boxedout-libs/shared/asset.enum';
import { JoinTypes } from '@nestjs-yalc/ag-grid/ag-grid.input';

const query_ManageUser_getUserGrid = (filters) => `
query{
  ManageUser_getUserGrid(${filters}) {
    nodes{
      ID
      firstName
      lastName
    }
  }
} 
`;

describe(`queries/${getTestFilename(__filename)} : Ag-Grid Test`, () => {
  let jwtManagement: string;
  let jwtAuditUser: string;
  let app: NestFastifyApplication;
  let loginApp: NestFastifyApplication;

  beforeAll(async () => {
    loginApp = await initApp(UserProviderModule.forRoot({ onlyAuth: true }));
    app = await initApp(ManagePanelModule.forRoot());

    jwtManagement = await getJWT(loginApp, RoleEnum.MANAGEMENT);
    jwtAuditUser = await getJWT(loginApp, RoleEnum.AUDIT_USER);
  });

  afterAll(async () => {
    loginApp && (await loginApp.close());
    return app && (await app.close());
  });

  it('Get one result', async () => {
    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwtManagement)
      .send({
        operationName: null,
        query: query_ManageUser_getUserGrid(
          getFiltersSoft({
            col: 'ID',
            filterType: 'text',
            type: GeneralFilters.CONTAINS,
            filter: SUPERUSER_GUID,
          }),
        ),
      })
      .expect(({ body }) => {
        const data = body.data?.ManageUser_getUserGrid?.nodes?.length
          ? body.data?.ManageUser_getUserGrid.nodes
          : undefined;
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(data).toBeDefined();
        expect(data.length).toEqual(1);
        expect(error).not.toBeDefined();
      })
      .expect(200);
  });

  it('Get no result', async () => {
    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwtManagement)
      .send({
        operationName: null,
        query: query_ManageUser_getUserGrid(
          getFiltersSoft({
            col: 'lastName',
            filterType: 'text',
            type: GeneralFilters.CONTAINS,
            filter: 'GFLKSHKKJFDGSHGJSAHFD', // a random string of chars which should never occur as lastName
          }),
        ),
      })
      .expect(({ body }) => {
        const data = body.data?.ManageUser_getUserGrid?.nodes?.length
          ? body.data?.ManageUser_getUserGrid.nodes
          : undefined;
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(data).not.toBeDefined();
        expect(body.data?.ManageUser_getUserGrid?.nodes?.length).toEqual(0);
        expect(error).not.toBeDefined();
      })
      .expect(200);
  });

  it('Number filter properly works', async () => {
    const query_number_filtered = `
      query {
        ManageMonitor_getUserDynamicGrid(
          startRow: 0
          endRow: 20
          sorting: [ { colId: "userId", sort: ASC } ]
          filters: "{\\"adminCommentCount\\":{\\"filterType\\":\\"number\\",\\"type\\":\\"equals\\",\\"filter\\":10}}"
        ) {
          nodes{
            userId
            adminCommentCount
          }
        }
      }`;

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwtAuditUser)
      .send({
        operationName: null,
        query: query_number_filtered,
      })
      .expect(({ body }) => {
        const results = body.data.ManageMonitor_getUserDynamicGrid.nodes;
        for (const result of results) {
          expect(result.adminCommentCount).toEqual(10);
        }

        const error = body.errors?.length ? body.errors[0].message : undefined;
        expect(error).not.toBeDefined();
      })
      .expect(200);
  });

  it('Filtering works for the child of a joined resource', async () => {
    const query_number_filtered = `
      query {
        ManageMonitor_getUserDynamicGrid(
          startRow: 0
          endRow: 20
          sorting: [ { colId: "userId", sort: ASC } ]
          filters: "{\\"UserTag.tag\\":{\\"filterType\\":\\"text\\",\\"type\\":\\"contains\\",\\"filter\\":\\"crypto\\"}}"
        ) {
          nodes{
            userId
            UserTag {
              tag
            }
          }
        }
      }`;

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwtAuditUser)
      .send({
        operationName: null,
        query: query_number_filtered,
      })
      .expect(({ body }) => {
        const results = body.data.ManageMonitor_getUserDynamicGrid.nodes;

        for (const result of results) {
          let tagFound = false;
          for (const tag of result.UserTag) {
            // every result should have at least 1 tag which contains 'crypto'
            if (tag.tag.includes('crypto')) {
              tagFound = true;
            }
          }
          expect(tagFound).toEqual(true);
        }

        const error = body.errors?.length ? body.errors[0].message : undefined;
        expect(error).not.toBeDefined();
      })
      .expect(200);
  });

  it('Text filter properly works', async () => {
    const query_text_filtered = `
      query {
        ManageMonitor_getUserDynamicGrid(
          startRow: 0
          endRow: 20
          sorting: [ { colId: "userId", sort: ASC } ]
          filters: "{\\"userId\\":{\\"filterType\\":\\"text\\",\\"type\\":\\"contains\\",\\"filter\\":\\"user_\\"}}"
        ) {
          nodes{
            userId
            adminCommentCount
          }
        }
      }`;

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwtAuditUser)
      .send({
        operationName: null,
        query: query_text_filtered,
      })
      .expect(({ body }) => {
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(error).not.toBeDefined();
      })
      .expect(200);
  });

  it('Date filter properly works', async () => {
    const query_date_filtered = `
      query {
        ManageMonitor_getUserDynamicGrid(
          startRow: 0
          endRow: 20
          sorting: [ { colId: "userId", sort: ASC } ]
          filters: "{\\"timestampCreated\\":{\\"dateFrom\\":\\"2021-03-29 00:00:00\\",\\"dateTo\\":\\"2021-03-30 00:00:00\\",\\"type\\":\\"inRange\\",\\"filterType\\":\\"date\\"}}"
        ) {
          nodes{
            userId
            timestampCreated
          }
        }
      }`;

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwtAuditUser)
      .send({
        operationName: null,
        query: query_date_filtered,
      })
      .expect(({ body }) => {
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(error).not.toBeDefined();
      })
      .expect(200);
  });

  it('Filter with OR properly works', async () => {
    const query_OR_filtered = `
      query {
        ManageMonitor_getUserDynamicGrid(
          startRow: 0
          endRow: 20
          sorting: [ { colId: "userId", sort: ASC } ]
          filters: "{\\"userId\\":{\\"filterType\\":\\"text\\",\\"type\\":\\"contains\\",\\"filter\\":\\"user_\\"},\\"adminCommentCount\\":{\\"filterType\\":\\"number\\",\\"operator\\":\\"OR\\",\\"condition1\\":{\\"filterType\\":\\"number\\",\\"type\\":\\"equals\\",\\"filter\\":10},\\"condition2\\":{\\"filterType\\":\\"number\\",\\"type\\":\\"greaterThan\\",\\"filter\\":10}},\\"timestampCreated\\":{\\"dateFrom\\":\\"2021-03-29 00:00:00\\",\\"dateTo\\":\\"2021-03-30 00:00:00\\",\\"type\\":\\"inRange\\",\\"filterType\\":\\"date\\"}}"
        ) {
          nodes{
            userId
            adminCommentCount
          }
        }
      }`;

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwtAuditUser)
      .send({
        operationName: null,
        query: query_OR_filtered,
      })
      .expect(({ body }) => {
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(error).not.toBeDefined();
      })
      .expect(200);
  });

  it('Filter on multicolumns properly works', async () => {
    const query_multiColumJoinOptions = `
      query{
        ManageUser_getUserGrid(startRow: 0
      endRow: 20
      sorting: [ { colId: "ID", sort: ASC } ]
      filters: "{\\"multiColumnJoinOptions\\":{\\"multiColumnJoinOperator\\":\\"or\\",\\"language\\":{\\"filterType\\":\\"text\\",\\"type\\":\\"contains\\",\\"filter\\":\\"e\\"},\\"multiColumnJoinOptions\\":{\\"multiColumnJoinOperator\\":\\"and\\",\\"language\\":{\\"filterType\\":\\"text\\",\\"type\\":\\"contains\\",\\"filter\\":\\"i\\"},\\"multiColumnJoinOptions\\":{\\"multiColumnJoinOperator\\":\\"or\\",\\"ID\\":{\\"filterType\\":\\"text\\",\\"type\\":\\"contains\\",\\"filter\\":\\"agent\\"},\\"firstName\\":{\\"filterType\\":\\"text\\",\\"type\\":\\"contains\\",\\"filter\\":\\"xxx\\"},\\"multiColumnJoinOptions\\":{\\"multiColumnJoinOperator\\":\\"and\\",\\"lastName\\":{\\"filterType\\":\\"text\\",\\"type\\":\\"equals\\",\\"filter\\":\\"xxx\\"}}}}}}"
      ){
          nodes{
            country
            firstName
            lastName
            language
          }
        }
      }`;

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwtManagement)
      .send({
        operationName: null,
        query: query_multiColumJoinOptions,
      })
      .expect(({ body }) => {
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(error).not.toBeDefined();
      })
      .expect(200);
  });

  it('Should return an error if rows requested are more than the dafult limit', async () => {
    await runQuery({
      app,
      loginApp,
      query: query_ManageUser_getUserGrid('endRow: 300'),
      queryName: 'ManageUser_getUserGrid',
      role: RoleEnum.MANAGEMENT,
      callback: (body) => {
        const error = body.errors?.length ? body.errors[0].message : undefined;
        expect(error).toEqual(
          expect.stringContaining('Invalid max number of row selected'),
        );
      },
      skipExpect: true,
    });
  });

  it('Should check if the join operator works well on autogenerated queries (UnclaimedDeposit)', async () => {
    const queryName = 'ManageCrypto_getDepositGlobalGrid';
    const query = `query ManageCrypto_getDepositGlobalGrid($join: DepositTypeJoinOptionsInputType){
      ManageCrypto_getDepositGlobalGrid(
        cryptoAsset: ${AssetCodeEnum.XLM},
        join: $join,
        startRow: 0,
        endRow: 2
      ) {
        nodes {
          UnclaimedDeposit {
              guid
              id
              status
              verifier1
              updatedAt
              createdAt
            User {
              firstName
            }
            Verifier1 {
              lastName
            }
          }    
        }
      }
    }`;
    await runQuery({
      app,
      loginApp,
      query,
      queryName,
      role: RoleEnum.SUPER_USER,
      skipExpect: true,
      variables: {
        join: {
          UnclaimedDeposit: {
            joinType: 'INNER_JOIN',
          },
        },
      },
      callback: (body) => {
        const returnedData = body.data?.[queryName];

        expect(returnedData?.nodes.length).toBeGreaterThan(0);

        for (const node of returnedData.nodes) {
          const { UnclaimedDeposit } = node;

          expect(UnclaimedDeposit.verifier1).toEqual(SUPERUSER_GUID);
          // Check userDL
          expect(UnclaimedDeposit.User.firstName).not.toBeNull();
          // Check Verifier DL
          expect(UnclaimedDeposit.Verifier1.lastName).not.toBeNull();
        }
      },
    });
  });
});
