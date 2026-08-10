/* istanbul ignore file */

import * as request from 'supertest';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  getAuth0TestJWT,
  getTestFilename,
  getTestJWT,
  getTestTwoFactorKey,
  initApp,
} from '@boxedout-libs/shared/jest/jest.helper';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CURAPP_CONF_ALIAS } from '@boxedout-libs/shared/def.const';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
import { HttpStatus } from '@nestjs/common';
import { UserChangeEmailDto } from '@boxedout/user/dto/user-change-email.type';
import { testingEntry } from '@boxedout-libs/shared/seeder-helper';
import { Connection } from 'typeorm';
import { getConnectionToken } from '@nestjs/typeorm';
import { DbConnection } from '@boxedout-libs/shared/db-default.conf';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';

describe(`rest/${getTestFilename(__filename)} : user-email Test`, () => {
  let app: NestFastifyApplication;
  let httpService: DeepMocked<HttpService>;
  let dbConnection: Connection;
  let internalJWT: string;
  let auth0JWT: string;
  const TEST_EMAIL = 'test@test.com';
  const TEST_PASSWORD = 'testtest';

  beforeAll(async () => {
    httpService = createMock<HttpService>();
    app = await initApp(
      UserProviderModule.forRoot(),
      CURAPP_CONF_ALIAS,
      'test',
      false,
      {
        beforeCompile: (testingModule) =>
          testingModule.overrideProvider(HttpService).useValue(httpService),
      },
    );
    internalJWT = await getTestJWT(app);
    auth0JWT = getAuth0TestJWT();
    dbConnection = app.get<Connection>(
      getConnectionToken(DbConnection.BOXEDOUT),
    );
    await dbConnection.query(
      "UPDATE userEmail SET status = 'verified' WHERE guid = ? AND email = ?",
      [testingEntry.guid, testingEntry.emails[0]],
    );
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await dbConnection.query(
      "UPDATE userEmail SET status = 'pending' WHERE guid = ? AND email = ?",
      [testingEntry.guid, testingEntry.emails[0]],
    );
    app && (await app.close());
    dbConnection.isConnected && (await dbConnection.close());
  });

  it('should return current password incorrect', async () => {
    const body: UserChangeEmailDto = {
      password: TEST_PASSWORD,
      email: TEST_EMAIL,
    };

    const expectedResponse = {
      title: 'current_password_incorrect',
      message: 'current_password_incorrect',
    };

    // Identity Manager Wrong Password
    httpService.post.mockImplementationOnce(() =>
      throwError(
        () =>
          ({
            response: {
              data: { message: 'Wrong password' },
              status: 401,
            },
          } as AxiosError),
      ),
    );

    return request(app.getHttpServer())
      .post('/users/v3/email')
      .set('Content-type', 'application/json')
      .set('User-Agent', 'test')
      .set('Authorization', auth0JWT)
      .send(body)
      .expect(HttpStatus.OK)
      .expect(expectedResponse);
  });

  it('should return email changed ok for auth0', async () => {
    const body: UserChangeEmailDto = {
      password: TEST_PASSWORD,
      email: TEST_EMAIL,
    };

    const expectedResponse = {
      title: 'email_changed_title',
      message: 'email_changed_message',
    };

    // Identity Manager OK
    httpService.post.mockImplementationOnce(() =>
      of({ status: 200 } as AxiosResponse),
    );

    return request(app.getHttpServer())
      .post('/users/v3/email')
      .set('Content-type', 'application/json')
      .set('User-Agent', 'test')
      .set('Authorization', auth0JWT)
      .send(body)
      .expect(HttpStatus.OK)
      .expect(expectedResponse);
  });

  it('should return email changed ok for internal user', async () => {
    dbConnection.query(
      "update userList set twoFactorLatest = '000000' where guid = ?",
      [testingEntry.guid],
    );

    const body: UserChangeEmailDto = {
      password: TEST_PASSWORD,
      email: TEST_EMAIL,
      twoFactor: getTestTwoFactorKey(),
    };

    const expectedResponse = {
      title: 'email_changed_title',
      message: 'email_changed_message',
    };

    // Identity Manager User Not Found
    httpService.post.mockImplementationOnce(() =>
      throwError(
        () =>
          ({
            response: {
              data: { message: 'No user found with guid' },
              status: 404,
            },
          } as AxiosError),
      ),
    );

    return request(app.getHttpServer())
      .post('/users/v3/email')
      .set('Content-type', 'application/json')
      .set('User-Agent', 'test')
      .set('Authorization', internalJWT)
      .send(body)
      .expect(HttpStatus.OK)
      .expect(expectedResponse);
  });
});
