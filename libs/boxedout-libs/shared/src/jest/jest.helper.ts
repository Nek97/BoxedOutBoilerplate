/* istanbul ignore file */

import * as request from 'supertest';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { GeneralFilters } from '@nestjs-yalc/ag-grid/ag-grid.enum';
import * as path from 'path';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { DynamicModule } from '@nestjs/common';
import { AppBootstrap } from '../app-helpers/app-bootstrap.helper';
import { CURAPP_CONF_ALIAS } from '../def.const';

import { TWO_FACTOR_STATIC_KEY } from '@boxedout-libs/shared/seeder-helper';
import { generateToken } from '@boxedout-libs/shared/helpers/two-factor.helper';

export function getTestFilename(testPath: string) {
  return path.basename(testPath);
}

const login = (role: string, mailSuffix: boolean): string => `
    mutation{
      User_login(username:"${role}${
  mailSuffix ? '@test.com' : ''
}", password:"testtest"){
        Authorization
      }
    }
  `;

/**
 * Get the testingEntry user login
 * @param app
 */
export const getTestJWT = (app: NestFastifyApplication) => {
  return getJWT(app, 'testingEntry', true, false);
};

/**
 * Get a Auth0 valid token
 */
export const getAuth0TestJWT = () => {
  return 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA0WHNRWW43TUFiLW1DTWx6dlpEbCJ9.eyJodHRwczovL2FwaS5kZXYudmF2by5kZXYiOnsiZ3VpZCI6IjVhODJlZDZhLWM2ZjYtNGMzNy1hYzQ2LWYyNmZhZWEyNTAxNyJ9LCJpc3MiOiJodHRwczovL2xvZ2luLmRldi52YXZvLmRldi8iLCJzdWIiOiJhdXRoMHw2MjgyMjVhYTdlMTc2ZTAwNjk5M2NmMDUiLCJhdWQiOlsiaHR0cHM6Ly9hcGkuZGV2LnZhdm8uZGV2IiwiaHR0cHM6Ly9kZXYtYml0dmF2by5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjUzMzA0OTQ3LCJleHAiOjE2NTMzOTEzNDcsImF6cCI6ImhRdms1SENaMHdSeE5hQlNwQk5tNHFKcVk5NmI5OUJlIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInBlcm1pc3Npb25zIjpbImludGVncmF0aW9uczpyZWFkIiwiaW50ZWdyYXRpb25zOndyaXRlIiwidXNlcnM6ZXhlY3V0ZSIsInVzZXJzOnJlYWQiLCJ1c2Vyczp3cml0ZSIsIndhdGNobGlzdDpyZWFkIiwid2F0Y2hsaXN0OndyaXRlIl19.TStzZlgRWgOQa_jvQ9T1bAaJIO5dIfJanB-urNryiJNlg77fCGxnw8qkFCEJHDszOvEL1fRRv9TagjN4IPwhS6Qcii_Z6rZcfzso8g2cERZFtY_VUdLGkU-MnMm3tqGC2ZQqECiv1CDn2u-jgL_lkmD-kv9IbSXcAjV_bvTAYKzWtz2pOjFciG8ND524F14IiD8nzoaq4kP2ildDIvYdEtQfBfi8-9SxNoBjDMRBgdqpn7o17wopNNnbaHhagd2EpP1AE5_0_noxh9LOlIKxL_9b1TC70fuKm2FzHzUecaYq4QjjDiC2c9C8nh8w3zaaQmxJwtiMyHvzq_8Equw8Sg';
};

export const getTestTwoFactorKey = () => {
  return generateToken(TWO_FACTOR_STATIC_KEY);
};

export const getJWT = async (
  app: NestFastifyApplication,
  role: string,
  bearerFormat = true,
  mailSuffix = true,
): Promise<string> => {
  let jwt: string;
  role = role.replace(/-/g, '_');
  const { body } = await request(app.getHttpServer())
    .post('/graphql')
    .send({
      operationName: null,
      query: login(role, mailSuffix),
    });

  bearerFormat
    ? (jwt = `Bearer ${body.data?.User_login?.Authorization}`)
    : (jwt = body.data?.User_login?.Authorization);
  return jwt;
};

/**
 * You can get the filtersInput for a graphql query in the ag-grid format, you can get a default filter by passing only a void json '{}'.
 * You can also customize the filters object with your specific object, or only passing some property.
 *
 * @param col the column where where the filter is applied, default 'userId'
 * @param filterType the type of the filter, default 'text'
 * @param type the filter to apply, from GeneralFilters, default 'GeneralFilters.Contains'
 * @param filter the filter value, default 'super'
 * @param filters the enteire filters string, to be merged with the other find options, the string must be in the following format `"{\\"colName\\":{\\"filterType\\": ... }"`
 * @return the findOptions string to be passed as parameter for the filtersInput in the query
 */
export const getFiltersSoft = ({
  col = 'userId',
  filterType = 'text',
  type = GeneralFilters.CONTAINS,
  filter = 'super',
  filters = undefined,
}) => {
  const setFilters = `"{\\"${col}\\":{\\"filterType\\":\\"${filterType}\\", \\"type\\":\\"${type}\\", \\"filter\\":\\"${filter}\\"}}"`;

  return `startRow:0, endRow:25, sorting:{colId:"${col}", sort:ASC}, filters:${
    filters ? filters : setFilters
  }`;
};

export const initApp = async (
  module: DynamicModule,
  appConfAlias = CURAPP_CONF_ALIAS,
  appAlias = 'test',
  /**
   * set to true in order to use the actual app instead of the TestingModule
   */
  actualApp = false,
  options?: {
    beforeCompile?: (testingModule: TestingModuleBuilder) => void;
  },
) => {
  const bootstrap = new AppBootstrap(appAlias, appConfAlias, module);

  if (!actualApp) {
    const testingModule: TestingModuleBuilder = Test.createTestingModule({
      imports: [module],
    });

    options?.beforeCompile?.(testingModule);

    const moduleFixture = await testingModule.compile();

    bootstrap.setApp(
      moduleFixture.createNestApplication<NestFastifyApplication>(
        new FastifyAdapter(),
      ),
    );
  } else {
    await bootstrap.createApp();
  }

  const app = bootstrap.getApp();

  await app.init();
  await app.getHttpAdapter().getInstance().ready();
  return app;
};

export const runQuery = async (options: {
  app: NestFastifyApplication;
  loginApp: NestFastifyApplication;
  query: string;
  queryName: string;
  role: RoleEnum;
  done?: (data?: any) => void;
  callback?: { (body: any): void };
  skipExpect?: boolean;
  statusCode?: number;
  variables?: any;
}) => {
  const {
    app,
    loginApp,
    query,
    queryName,
    role,
    callback,
    // done,
    skipExpect = false,
    statusCode = 200,
    variables,
  } = options;
  const jwt = await getJWT(loginApp, role);

  return request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', jwt)
    .send({
      operationName: null,
      query,
      variables,
    })
    .expect(({ body }) => {
      const data = body.data?.[queryName];
      const errors = body.errors?.length ? body.errors : undefined;

      if (!skipExpect) {
        if (errors) {
          // eslint-disable-next-line no-console
          console.error(errors);
        }

        expect(errors).not.toBeDefined();
        expect(data).toBeDefined();
      }

      callback && callback(body);
    })
    .expect(statusCode);
};
