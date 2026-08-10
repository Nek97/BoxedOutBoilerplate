/* istanbul ignore file */

import * as request from 'supertest';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  getTestFilename,
  initApp,
} from '@boxedout-libs/shared/jest/jest.helper';

describe(`mutations/${getTestFilename(__filename)} : Login test`, () => {
  let app: NestFastifyApplication;
  beforeAll(async () => {
    app = await initApp(UserProviderModule.forRoot());
  });

  afterAll(async () => {
    app && (await app.close());
  });

  test('Mutation Login', async () => {
    const login = `
    mutation{
      User_login(username:"super_user@test.com", password:"testtest"){
        Authorization
      }
    }
  `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: login,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(({ body }) => {
        console.log(body);
        const data = body.data;
        const result = data?.User_login?.Authorization;
        expect(result).toBeDefined();
      })
      .expect(200);
  });
});
