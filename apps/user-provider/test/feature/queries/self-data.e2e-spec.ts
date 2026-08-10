/* istanbul ignore file */

import * as request from 'supertest';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import {
  getJWT,
  getTestFilename,
  initApp,
} from '@boxedout-libs/shared/jest/jest.helper';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';

describe(`queries/${getTestFilename(__filename)} : getSelfData Test`, () => {
  let app: NestFastifyApplication;
  beforeAll(async () => {
    app = await initApp(UserProviderModule.forRoot());
  });

  afterAll(async () => {
    return app && (await app.close());
  });

  it('Get result', async () => {
    const jwt = await getJWT(app, RoleEnum.SUPER_USER);
    const query_User_getSelfData = `
    query{
      User_getSelfData{
        userId
        roleList
        firstName
      }
    }
    `;

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', jwt)
      .send({
        operationName: null,
        query: query_User_getSelfData,
      })
      .expect(({ body }) => {
        const data = body.data?.User_getSelfData;
        const errors = body.errors?.length ? body.errors : undefined;

        if (errors) {
          // eslint-disable-next-line no-console
          console.error(errors);
        }

        expect(errors).not.toBeDefined();
        expect(data).toBeDefined();
        expect(data.roleList.length).toEqual(2);
      })
      .expect(200);
  });
});
