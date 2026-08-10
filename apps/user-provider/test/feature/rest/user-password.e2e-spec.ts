/* istanbul ignore file */

import * as request from 'supertest';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  getAuth0TestJWT,
  getTestFilename,
  getTestJWT,
  initApp,
} from '@boxedout-libs/shared/jest/jest.helper';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';
import { UserChangePasswordDto } from '@boxedout/user/dto/user-change-password.type';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CURAPP_CONF_ALIAS } from '@boxedout-libs/shared/def.const';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse, AxiosError } from 'axios';
import { of, throwError } from 'rxjs';
import { HttpStatus } from '@nestjs/common';

describe(`rest/${getTestFilename(__filename)} : user-password Test`, () => {
  let app: NestFastifyApplication;
  let httpService: DeepMocked<HttpService>;
  let internalJWT: string;
  let auth0JWT: string;

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
  });

  afterAll(async () => {
    app && (await app.close());
  });

  it('should return current password incorrect for internal user', async () => {
    const body: UserChangePasswordDto = {
      password_current: 'notmycurrentpassword',
      password_new1: 'testtest2',
      password_new2: 'testtest2',
    };

    const expectedResponse = {
      title: 'current_password_incorrect',
      message: 'current_password_incorrect',
    };

    return request(app.getHttpServer())
      .post('/users/v3/password')
      .set('Content-type', 'application/json')
      .set('User-Agent', 'test')
      .set('Authorization', internalJWT)
      .send(body)
      .expect(HttpStatus.OK)
      .expect(expectedResponse);
  });

  it('should change user password on both internal and identity manager', async () => {
    const body: UserChangePasswordDto = {
      password_current: 'testtest',
      password_new1: 'testtest2',
      password_new2: 'testtest2',
    };

    const expectedResponse = {
      title: 'password_changed_title',
      message: 'password_changed_message',
    };

    // Identity Manager OK
    httpService.post.mockImplementationOnce(() =>
      of({ status: 200 } as AxiosResponse),
    );

    return request(app.getHttpServer())
      .post('/users/v3/password')
      .set('Content-type', 'application/json')
      .set('User-Agent', 'test')
      .set('Authorization', internalJWT)
      .send(body)
      .expect(HttpStatus.OK)
      .expect(expectedResponse);
  });

  it('should change user password successful even when internal user doesnt exist on Identity Manager', async () => {
    const body: UserChangePasswordDto = {
      password_current: 'testtest2',
      password_new1: 'testtest3',
      password_new2: 'testtest3',
    };

    const expectedResponse = {
      title: 'password_changed_title',
      message: 'password_changed_message',
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
      .post('/users/v3/password')
      .set('Content-type', 'application/json')
      .set('User-Agent', 'test')
      .set('Authorization', internalJWT)
      .send(body)
      .expect(HttpStatus.OK)
      .expect(expectedResponse);
  });

  it('should return current password incorrect when identity manager returns not authorized', async () => {
    const body: UserChangePasswordDto = {
      password_current: 'testtest',
      password_new1: 'testtest2',
      password_new2: 'testtest2',
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
      .post('/users/v3/password')
      .set('Content-type', 'application/json')
      .set('User-Agent', 'test')
      .set('Authorization', auth0JWT)
      .send(body)
      .expect(HttpStatus.OK)
      .expect(expectedResponse);
  });

  it('should change user password when user is Auth0', async () => {
    const body: UserChangePasswordDto = {
      password_current: 'testtest',
      password_new1: 'testtest2',
      password_new2: 'testtest2',
    };

    const expectedResponse = {
      title: 'password_changed_title',
      message: 'password_changed_message',
    };

    // Identity Manager OK
    httpService.post.mockImplementationOnce(() =>
      of({ status: 200 } as AxiosResponse),
    );

    return request(app.getHttpServer())
      .post('/users/v3/password')
      .set('Content-type', 'application/json')
      .set('User-Agent', 'test')
      .set('Authorization', auth0JWT)
      .send(body)
      .expect(HttpStatus.OK)
      .expect(expectedResponse);
  });

  it('should restore user password on both internal and identity manager', async () => {
    const body: UserChangePasswordDto = {
      password_current: 'testtest3',
      password_new1: 'testtest',
      password_new2: 'testtest',
    };

    const expectedResponse = {
      title: 'password_changed_title',
      message: 'password_changed_message',
    };

    // Identity Manager OK
    httpService.post.mockImplementationOnce(() =>
      of({ status: 200 } as AxiosResponse),
    );

    return request(app.getHttpServer())
      .post('/users/v3/password')
      .set('Content-type', 'application/json')
      .set('User-Agent', 'test')
      .set('Authorization', internalJWT)
      .send(body)
      .expect(HttpStatus.OK)
      .expect(expectedResponse);
  });
});
