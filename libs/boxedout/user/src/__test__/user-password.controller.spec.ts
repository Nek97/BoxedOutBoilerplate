import { UserPasswordController } from '../user-password.controller';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UserPasswordService } from '../user-password.service';
import { FastifyRequest } from 'fastify';
import { BoxedOutLegacyService } from '@boxedout/user/legacy/boxedout-legacy.service';
import {
  IncorrectPasswordError,
  InputValidationError,
} from '@boxedout/user/legacy/common.error';
import { UserPasswordIncorrectException } from '@boxedout-libs/identity-manager-client/exception/user-password-incorrect.exception';
import { UserNotFoundException } from '@boxedout-libs/identity-manager-client/exception/user-not-found.exception';
import { UserPasswordAlreadyUsedException } from '@boxedout-libs/identity-manager-client/exception/user-password-already-used.exception';
import { AuthService } from '@boxedout/auth/auth.service';
import { UserChangePasswordDto } from '@boxedout/user/dto/user-change-password.type';

describe('UserPasswordController test', () => {
  let userPasswordController: UserPasswordController;
  let userPasswordService: DeepMocked<UserPasswordService>;
  let legacyService: DeepMocked<BoxedOutLegacyService>;
  let authService: DeepMocked<AuthService>;
  const SOME_GUID = 'f5a1270b-f609-4fdc-acc7-045edaf91451';
  const SOME_JWT = 'eyJhbGci.jM5MDIyfQ.Sk6yJV_adQssw5c';
  const SOME_USER_AGENT = 'Chrome';
  const SOME_IP = '10.0.0.1';

  beforeAll(() => {
    userPasswordService = createMock<UserPasswordService>();
    legacyService = createMock<BoxedOutLegacyService>();
    authService = createMock<AuthService>();

    userPasswordController = new UserPasswordController(
      legacyService,
      userPasswordService,
      authService,
    );
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw InputValidationError when password is empty', async () => {
    const request = createMock<FastifyRequest>();
    await expect(
      userPasswordController.changeUserPassword(
        request,
        {
          password_current: '',
          password_new1: 'test',
          password_new2: 'test',
        },
        SOME_USER_AGENT,
      ),
    ).rejects.toThrowError(new InputValidationError('password_empty'));
  });

  it('should throw InputValidationError when new password is short', async () => {
    const request = createMock<FastifyRequest>();
    await expect(
      userPasswordController.changeUserPassword(
        request,
        {
          password_current: 'test',
          password_new1: 'test',
          password_new2: 'test',
        },
        SOME_USER_AGENT,
      ),
    ).rejects.toThrowError(new InputValidationError('password_minimal_length'));
  });

  it('should throw InputValidationError when new password is empty', async () => {
    const request = createMock<FastifyRequest>();
    await expect(
      userPasswordController.changeUserPassword(
        request,
        {
          password_current: '1234',
          password_new1: '',
          password_new2: '1234',
        },
        SOME_USER_AGENT,
      ),
    ).rejects.toThrowError(new InputValidationError('password_empty'));
  });

  it('should throw InputValidationError when new password is longer than 72 characters', async () => {
    const request = createMock<FastifyRequest>();
    await expect(
      userPasswordController.changeUserPassword(
        request,
        {
          password_current: '1234',
          password_new1:
            'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest',
          password_new2:
            'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest',
        },
        SOME_USER_AGENT,
      ),
    ).rejects.toThrowError(new InputValidationError('password_too_long'));
  });

  it('should throw InputValidationError when password confirmation does not match', async () => {
    const request = createMock<FastifyRequest>();
    await expect(
      userPasswordController.changeUserPassword(
        request,
        {
          password_current: 'testtest',
          password_new1: 'testtest1',
          password_new2: 'testtest',
        },
        SOME_USER_AGENT,
      ),
    ).rejects.toThrowError(new InputValidationError('passwords_do_not_match'));

    expect(userPasswordService.changeUserPassword).not.toHaveBeenCalled();
    expect(legacyService.changeUserPassword).not.toHaveBeenCalled();
  });

  it('should call correctly the services when user is auth0', async () => {
    const request = {
      user: { sub: 'hello', guid: SOME_GUID },
    } as unknown as FastifyRequest;
    const body: UserChangePasswordDto = {
      password_current: 'testtest',
      password_new1: 'testtest',
      password_new2: 'testtest',
    };
    authService.getIpFromRequest.mockReturnValue(SOME_IP);
    authService.getJwtFromRequest.mockReturnValue(SOME_JWT);
    const result = await userPasswordController.changeUserPassword(
      request,
      body,
      SOME_USER_AGENT,
    );
    expect(result).toMatchObject({
      message: 'password_changed_message',
      title: 'password_changed_title',
    });

    expect(userPasswordService.changeUserPassword).toHaveBeenCalledWith(
      SOME_GUID,
      body,
      SOME_JWT,
      SOME_USER_AGENT,
      SOME_IP,
    );
    expect(legacyService.changeUserPassword).not.toHaveBeenCalled();
  });

  it('should throw when the auth0 password is incorrect', async () => {
    userPasswordService.changeUserPassword.mockRejectedValue(
      new UserPasswordIncorrectException(),
    );
    const request = { user: { sub: 'hello' } } as unknown as FastifyRequest;
    await expect(
      userPasswordController.changeUserPassword(
        request,
        {
          password_current: 'testtest',
          password_new1: 'testtest',
          password_new2: 'testtest',
        },
        SOME_USER_AGENT,
      ),
    ).rejects.toThrowError(
      new IncorrectPasswordError('current_password_incorrect'),
    );

    expect(userPasswordService.changeUserPassword).toHaveBeenCalled();
    expect(legacyService.changeUserPassword).not.toHaveBeenCalled();
  });

  it('should throw when the password was already used', async () => {
    userPasswordService.changeUserPassword.mockRejectedValue(
      new UserPasswordAlreadyUsedException(),
    );
    const request = { user: { sub: 'hello' } } as unknown as FastifyRequest;
    await expect(
      userPasswordController.changeUserPassword(
        request,
        {
          password_current: 'testtest',
          password_new1: 'testtest',
          password_new2: 'testtest',
        },
        SOME_USER_AGENT,
      ),
    ).rejects.toThrowError(new IncorrectPasswordError('password_already_used'));

    expect(userPasswordService.changeUserPassword).toHaveBeenCalled();
    expect(legacyService.changeUserPassword).not.toHaveBeenCalled();
  });

  it('should throw when the auth0 user is not found', async () => {
    userPasswordService.changeUserPassword.mockRejectedValue(
      new UserNotFoundException('1234'),
    );
    const request = { user: { sub: 'hello' } } as unknown as FastifyRequest;
    await expect(
      userPasswordController.changeUserPassword(
        request,
        {
          password_current: 'testtest',
          password_new1: 'testtest',
          password_new2: 'testtest',
        },
        SOME_USER_AGENT,
      ),
    ).rejects.toThrowError(new UserNotFoundException('1234'));

    expect(userPasswordService.changeUserPassword).toHaveBeenCalled();
    expect(legacyService.changeUserPassword).not.toHaveBeenCalled();
  });

  it('should call correctly the services when user has legacy token', async () => {
    legacyService.guid.mockResolvedValue(SOME_GUID);
    const request = { user: { id: 'abcd' } } as unknown as FastifyRequest;
    const body: UserChangePasswordDto = {
      password_current: 'testtest',
      password_new1: 'testtest',
      password_new2: 'testtest',
    };
    authService.getIpFromRequest.mockReturnValue(SOME_IP);
    authService.getJwtFromRequest.mockReturnValue(SOME_JWT);
    const result = await userPasswordController.changeUserPassword(
      request,
      body,
      SOME_USER_AGENT,
    );
    expect(result).toMatchObject({
      message: 'password_changed_message',
      title: 'password_changed_title',
    });

    expect(userPasswordService.changeUserPassword).toHaveBeenCalledWith(
      SOME_GUID,
      body,
      SOME_JWT,
      SOME_USER_AGENT,
      SOME_IP,
    );
    expect(legacyService.changeUserPassword).toHaveBeenCalled();
  });
});
