/* istanbul ignore file */

import * as request from 'supertest';
import { ManagePanelModule } from '@boxedout-app/manage-panel/manage-panel.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { ErrorsEnum } from '@boxedout-libs/errors/errors.enum';
import {
  getJWT,
  getTestFilename,
  initApp,
} from '@boxedout-libs/shared/jest/jest.helper';
import { testingEntry } from '@boxedout-libs/shared/seeder-helper';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';

const query_ManageUser_getUser = `
query{
  ManageUser_getUser(ID:"${testingEntry.guid}"){
    ID
  }
}
`;

describe(`queries/${getTestFilename(__filename)} : JWT Test`, () => {
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

  it('Get result', async () => {
    const jwt = await getJWT(loginApp, RoleEnum.AGENT);

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwt)
      .send({
        operationName: null,
        query: query_ManageUser_getUser,
      })
      .expect(({ body }) => {
        const data = body.data?.ManageUser_getUser;
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(data).toBeDefined();
        expect(error).not.toBeDefined();
      })
      .expect(200);
  });

  it('Get "Forbidden resuorce" error for not allowed role', async () => {
    const jwt = await getJWT(loginApp, RoleEnum.TEST);

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwt)
      .send({
        operationName: null,
        query: query_ManageUser_getUser,
      })
      .expect(({ body }) => {
        const data = body.data?.ManageUser_getUser;
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(data).not.toBeDefined();
        expect(error).toEqual(ErrorsEnum.FORBIDDEN_RESOURCE);
      })
      .expect(200);
  });

  it('Get result with no valid jwt', async () => {
    const jwt = (await getJWT(loginApp, RoleEnum.AGENT)).replace('e', 'a');
    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwt)
      .send({
        operationName: null,
        query: query_ManageUser_getUser,
      })
      .expect(({ body }) => {
        const data = body.data?.ManageUser_getUser;
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(data).not.toBeDefined();
        expect(error).toEqual(ErrorsEnum.UNAUTHORIZED);
      })
      .expect(200);
  });
});
