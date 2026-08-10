import {
  AuthMiddleware,
  AuthMiddlewareDev,
  getUserCallback,
} from '@boxedout/auth/auth.middleware';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AuthService } from '@boxedout/auth/auth.service';
import * as PassportContext from '../passport.context';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AudienceEnum, IUserPayload } from '../jwt-private.strategy';
import { RoleService } from '@boxedout/manage-user/role.service';
import { UnauthorizedError } from '@boxedout-libs/errors';
import { envTestHelper } from '@nestjs-yalc/jest/env.helper';
import { LoggerService } from '@nestjs/common';

describe('App interceptor test', () => {
  let authMiddlewareTest: AuthMiddleware;
  let mockedAuthService: DeepMocked<AuthService>;
  const mockedRoleService = createMock<RoleService>();
  let fixedReq;
  let fixedGoodReq;
  let fixedBadReq;
  let fixedReply;
  const mockedLoggerService = createMock<LoggerService>();

  beforeEach(async () => {
    mockedAuthService = createMock<AuthService>();
    authMiddlewareTest = new AuthMiddleware(
      mockedRoleService,
      mockedAuthService,
      mockedLoggerService,
    );

    mockedAuthService.createPrivateJwt.mockReturnValue('jwttest');

    fixedReq = createMock<FastifyRequest>();
    fixedReq.headers.authorization = undefined;
    fixedGoodReq = createMock<FastifyRequest>();
    fixedGoodReq.headers.authorization = 'Bearer jwt';
    fixedBadReq = createMock<FastifyRequest>();
    fixedBadReq.headers.authorization = 'bad req';
    fixedReply = createMock<FastifyReply>();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Check middleware call', async () => {
    expect(authMiddlewareTest).toBeDefined();
    const testData = authMiddlewareTest;
    expect(testData).toBeDefined();
  });

  it('Check canActivateWithReq', async () => {
    jest
      .spyOn(PassportContext, 'createPassportContext')
      .mockReturnValue(async (data1, data2, callback) =>
        callback(data1, data2, 'user', data1),
      );
    const testData = await authMiddlewareTest.canActivateWithReq(null, null);
    expect(testData).toBeDefined();
  });

  it('Check function use with good req', async () => {
    jest
      .spyOn(authMiddlewareTest, 'canActivateWithReq')
      .mockResolvedValue({ someProperty: 'someData' });

    mockedAuthService.isValidPrivateJwt.mockReturnValue(false);

    await authMiddlewareTest.use(fixedGoodReq, fixedReply, () => null);
    expect(fixedGoodReq.headers.authorization).toBe('Bearer jwttest');
  });

  it('should validate private token', async () => {
    jest
      .spyOn(authMiddlewareTest, 'canActivateWithReq')
      .mockResolvedValue({ someProperty: 'someData' });

    await authMiddlewareTest.use(fixedGoodReq, fixedReply, () => null);
    expect(fixedGoodReq.headers.authorization).toBe('Bearer jwt');
  });

  it('Throw error with bad payload', async () => {
    mockedAuthService.isValidPrivateJwt.mockReturnValue(false);

    jest
      .spyOn(authMiddlewareTest, 'canActivateWithReq')
      .mockResolvedValue({ someProperty: 'someData' });
    mockedAuthService.validatePayload.mockReturnValue({});
    mockedAuthService.validateRequest.mockReturnValue(null);

    expect(
      async () =>
        await authMiddlewareTest.use(fixedGoodReq, fixedReply, () => null),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('Check function use with jwt undefined', async () => {
    mockedAuthService.isValidPrivateJwt.mockReturnValue(false);

    jest
      .spyOn(authMiddlewareTest, 'canActivateWithReq')
      .mockResolvedValue(null);
    await authMiddlewareTest.use(fixedGoodReq, fixedReply, () => null);
    expect(fixedGoodReq.headers.authorization).toBe(undefined);
  });

  it('Check getUserCallback', async () => {
    const testGetUserCallback = getUserCallback;
    const userPayload: IUserPayload = {
      aud: AudienceEnum.WEBSITE,
      ip: '',
      sessionId: '',
      userId: '',
      roles: [],
    };

    expect(
      testGetUserCallback(mockedLoggerService)(null, userPayload, null),
    ).toEqual(userPayload);
  });

  it('should execute AuthMiddlewareDev correctly', async () => {
    mockedAuthService.isValidPrivateJwt.mockReturnValue(false);

    const authMiddlewareDev = new AuthMiddlewareDev(
      mockedRoleService,
      mockedAuthService,
      mockedLoggerService,
    );

    expect(authMiddlewareDev).toBeDefined();

    // when activated
    await authMiddlewareDev.use(fixedGoodReq, fixedReply, () => null);
    expect(fixedGoodReq.headers.authorization).toBe('Bearer jwttest');
  });

  it('should not execute AuthMiddlewareDev', async () => {
    const authMiddlewareDev = new AuthMiddlewareDev(
      mockedRoleService,
      mockedAuthService,
      mockedLoggerService,
    );

    // when not activated
    const envHelper = envTestHelper({ NODE_ENV: 'production' });
    await authMiddlewareDev.use(fixedGoodReq, fixedReply, () => null);
    expect(fixedGoodReq.headers.authorization).toBe('Bearer jwt');
    envHelper.reset();
  });

  it('Check AuthMiddlewareDev error', async () => {
    mockedAuthService.isValidPrivateJwt.mockReturnValue(false);
    const spy = jest
      .spyOn(PassportContext, 'createPassportContext')
      .mockImplementation(() => {
        throw new Error();
      });
    const authMiddlewareDev = new AuthMiddlewareDev(
      mockedRoleService,
      mockedAuthService,
      mockedLoggerService,
    );
    expect(authMiddlewareDev).toBeDefined();

    await authMiddlewareDev.use(fixedBadReq, fixedReply, () => null);
    spy.mockClear();
  });
});
