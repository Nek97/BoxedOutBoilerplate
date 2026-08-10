/* istanbul ignore file */

import * as request from 'supertest';
import { ManagePanelModule } from '@boxedout-app/manage-panel/manage-panel.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import {
  getJWT,
  getTestFilename,
  initApp,
  runQuery,
} from '../../../../../libs/boxedout-libs/shared/src/jest/jest.helper';
import { UserPhoneStatusEnum } from '@boxedout-libs/db-boxedout/entities/user-phone.enum';
import { v4 as uuid } from 'uuid';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';
import { LogActionTypeEnum } from '@boxedout-libs/shared/log-action.enum';

const fixedGuid = uuid();
const fixedPhone = '+31 6 12345679';
const fixedChangedPhone = '+31 6 12345680';
const fixedStatus = UserPhoneStatusEnum.PENDING;
const fixedChangedStatus = UserPhoneStatusEnum.VERIFIED;

describe(`mutations/${getTestFilename(__filename)} : userPhone Test`, () => {
  let jwtAgent: string;
  let app: NestFastifyApplication;
  let loginApp: NestFastifyApplication;

  beforeAll(async () => {
    loginApp = await initApp(UserProviderModule.forRoot({ onlyAuth: true }));
    app = await initApp(ManagePanelModule.forRoot());

    jwtAgent = await getJWT(loginApp, RoleEnum.AGENT);
  });

  afterAll(async () => {
    loginApp && (await loginApp.close());
    return app && (await app.close());
  });

  it('should get no result', async () => {
    const query_ManageUser_getUserPhoneGrid = `query {
      ManageUser_getUserPhoneGrid(
        startRow: 0
        endRow: 20
        sorting: [ { colId: "userId", sort: ASC } ]
        filters: "{}"
        userId:"${fixedGuid}"
        ) {
          nodes{
            userId
            phone
            status
            active
            timestamp
          }
        }
      }`;
    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwtAgent)
      .send({
        operationName: null,
        query: query_ManageUser_getUserPhoneGrid,
      })
      .expect(({ body }) => {
        const data = body.data?.ManageUser_getUserPhoneGrid?.nodes?.length
          ? body.data?.ManageUser_getUserPhoneGrid.nodes
          : undefined;
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(data).not.toBeDefined();
        expect(body.data?.ManageUser_getUserPhoneGrid?.nodes?.length).toEqual(
          0,
        );
        expect(error).not.toBeDefined();
      })
      .expect(200);
  });

  it('should not have log action', async () => {
    const query_ManageMonitor_getLogActionGrid = `query ManageMonitor_getLogActionGrid($filters: FilterInput) {
      ManageMonitor_getLogActionGrid(filters: $filters) {
        nodes {
          adminId
          data
        }
      }
    }`;

    await runQuery({
      app,
      loginApp,
      query: query_ManageMonitor_getLogActionGrid,
      queryName: 'ManageMonitor_getLogActionGrid',
      role: RoleEnum.SHIFT_LEAD,
      variables: {
        filters: JSON.stringify({
          type: {
            filterType: 'text',
            type: 'equals',
            filter: LogActionTypeEnum.USER_PHONE_CREATED,
          },
        }),
      },
      callback: (body) => {
        const data = body.data?.ManageMonitor_getLogActionGrid;
        expect(data.nodes.length).toEqual(0);
      },
    });
  });

  it('should create userPhone', async () => {
    const mutation_ManageUser_createUserPhone = `mutation{
      ManageUser_createUserPhone(input:{userId:"${fixedGuid}",phone:"${fixedPhone}", status:"${fixedStatus}"}){
        phone,
        userId
        status
        active
        timestamp
      }
    }`;
    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwtAgent)
      .send({
        operationName: null,
        query: mutation_ManageUser_createUserPhone,
      })
      .expect(({ body }) => {
        const data = body.data?.ManageUser_createUserPhone
          ? body.data?.ManageUser_createUserPhone
          : undefined;
        const error = body.errors?.length ? body.errors[0].message : undefined;
        expect(data).toBeDefined();
        expect(error).not.toBeDefined();
      })
      .expect(200);
  });

  it('should have log action', async () => {
    const query_ManageMonitor_getLogActionGrid = `query ManageMonitor_getLogActionGrid($filters: FilterInput) {
      ManageMonitor_getLogActionGrid(filters: $filters) {
        nodes {
          adminId
          data
        }
      }
    }`;

    await runQuery({
      app,
      loginApp,
      query: query_ManageMonitor_getLogActionGrid,
      queryName: 'ManageMonitor_getLogActionGrid',
      role: RoleEnum.SHIFT_LEAD,
      variables: {
        filters: JSON.stringify({
          type: {
            filterType: 'text',
            type: 'equals',
            filter: LogActionTypeEnum.USER_PHONE_CREATED,
          },
        }),
      },
      callback: (body) => {
        const data = body.data?.ManageMonitor_getLogActionGrid;
        expect(data.nodes.length).toEqual(1);
      },
    });
  });

  it('should update userPhone', async () => {
    const mutation_ManageUser_updateUserPhone = `mutation{
      ManageUser_updateUserPhone(input:{phone:"${fixedChangedPhone}", status:"${fixedChangedStatus}"},conditions:{userId:"${fixedGuid}",phone:"${fixedPhone}", status:"${fixedStatus}"}){
        phone,
        userId
        status
        active
        timestamp
      }
    }`;
    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwtAgent)
      .send({
        operationName: null,
        query: mutation_ManageUser_updateUserPhone,
      })
      .expect(({ body }) => {
        const data = body.data?.ManageUser_updateUserPhone
          ? body.data?.ManageUser_updateUserPhone
          : undefined;
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(data).toBeDefined();
        expect(error).not.toBeDefined();
      })
      .expect(200);
  });

  it('should delete userPhone', async () => {
    const mutation_ManageUser_deleteUserPhone = `mutation{
      ManageUser_deleteUserPhone(conditions:{userId:"${fixedGuid}",phone:"${fixedChangedPhone}", status:"${fixedChangedStatus}"})
    }`;
    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwtAgent)
      .send({
        operationName: null,
        query: mutation_ManageUser_deleteUserPhone,
      })
      .expect(({ body }) => {
        const result = body.data?.ManageUser_deleteUserPhone;
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(result).toEqual(true);
        expect(error).not.toBeDefined();
      })
      .expect(200);
  });
});
