import { IdentityManagerClientService } from '../identity-manager-client.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UserChangeEmailDto } from '@boxedout-libs/identity-manager-client/dto/user-change-email.dto';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { UserNotFoundException } from '@boxedout-libs/identity-manager-client/exception/user-not-found.exception';
import { UserPasswordIncorrectException } from '@boxedout-libs/identity-manager-client/exception/user-password-incorrect.exception';
import { UserSameEmailException } from '@boxedout-libs/identity-manager-client/exception/user.same.email.exception';
import { UserChangePasswordDto } from '@boxedout-libs/identity-manager-client/dto/user-change-password.dto';
import { UserPasswordAlreadyUsedException } from '@boxedout-libs/identity-manager-client/exception/user-password-already-used.exception';

describe('IdentityManagerClientService test', () => {
  let identityManagerClientService: IdentityManagerClientService;
  let httpService: DeepMocked<HttpService>;
  let configService: DeepMocked<ConfigService>;
  const SOME_GUID = 'f5a1270b-f609-4fdc-acc7-045edaf91451';
  const SOME_JWT = 'eyJhbGci.jM5MDIyfQ.Sk6yJV_adQssw5c';
  const SOME_USER_AGENT = 'Chrome';
  const SOME_IP = '10.0.0.1';
  const SOME_IDENTITY_MANAGER_URL = 'http://identitymanager.boxedout.com';

  beforeAll(() => {
    httpService = createMock<HttpService>();
    configService = createMock<ConfigService>({
      get: () => ({
        identityManagerURL: SOME_IDENTITY_MANAGER_URL,
      }),
    });
    identityManagerClientService = new IdentityManagerClientService(
      httpService,
      configService,
    );
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('changeUserPassword', () => {
    const SOME_BODY: UserChangePasswordDto = {
      currentPassword: '1234',
      newPassword: '1234',
      newPasswordConfirmation: '1234',
    };

    it('should resolve on success call to identity manager', async () => {
      httpService.post.mockReturnValueOnce(
        of({ status: 204 } as AxiosResponse),
      );

      await expect(
        identityManagerClientService.changeUserPassword(
          SOME_GUID,
          SOME_BODY,
          SOME_JWT,
          SOME_USER_AGENT,
          SOME_IP,
        ),
      ).resolves.toBeUndefined();

      expect(httpService.post).toBeCalledWith(
        `${SOME_IDENTITY_MANAGER_URL}/users/${SOME_GUID}/password`,
        SOME_BODY,
        {
          headers: {
            Authorization: `Bearer ${SOME_JWT}`,
            'User-Agent': SOME_USER_AGENT,
            'X-Forwarded-For': SOME_IP,
          },
        },
      );
    });
    it('should throw UserNotFoundException case identity manager return 404', async () => {
      httpService.post.mockReturnValueOnce(
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
      await expect(
        identityManagerClientService.changeUserPassword(
          SOME_GUID,
          SOME_BODY,
          SOME_JWT,
          SOME_USER_AGENT,
          SOME_IP,
        ),
      ).rejects.toThrowError(new UserNotFoundException(SOME_GUID));
    });

    it('should throw UserPasswordIncorrectException case identity manager return 401', async () => {
      httpService.post.mockReturnValueOnce(
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
      await expect(
        identityManagerClientService.changeUserPassword(
          SOME_GUID,
          SOME_BODY,
          SOME_JWT,
          SOME_USER_AGENT,
          SOME_IP,
        ),
      ).rejects.toThrowError(new UserPasswordIncorrectException());
    });
    it('should throw UserPasswordAlreadyUsedException case identity manager return 400 with specific message', async () => {
      httpService.post.mockReturnValueOnce(
        throwError(
          () =>
            ({
              response: {
                data: { message: 'Password has previously been used' },
                status: 400,
              },
            } as AxiosError),
        ),
      );
      await expect(
        identityManagerClientService.changeUserPassword(
          SOME_GUID,
          SOME_BODY,
          SOME_JWT,
          SOME_USER_AGENT,
          SOME_IP,
        ),
      ).rejects.toThrowError(new UserPasswordAlreadyUsedException());
    });
  });

  describe('changeUserEmail', () => {
    const SOME_BODY: UserChangeEmailDto = {
      newEmail: 'new-email@test.com',
      password: '1234',
      twoFactor: '123456',
    };

    it('should resolve on success call to identity manager', async () => {
      httpService.post.mockReturnValueOnce(
        of({ status: 204 } as AxiosResponse),
      );

      await expect(
        identityManagerClientService.changeUserEmail(
          SOME_GUID,
          SOME_BODY,
          SOME_JWT,
          SOME_USER_AGENT,
          SOME_IP,
        ),
      ).resolves.toBeUndefined();

      expect(httpService.post).toBeCalledWith(
        `${SOME_IDENTITY_MANAGER_URL}/users/${SOME_GUID}/email`,
        SOME_BODY,
        {
          headers: {
            Authorization: `Bearer ${SOME_JWT}`,
            'User-Agent': SOME_USER_AGENT,
            'X-Forwarded-For': SOME_IP,
          },
        },
      );
    });

    it('should throw UserNotFoundException case identity manager return 404', async () => {
      httpService.post.mockReturnValueOnce(
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
      await expect(
        identityManagerClientService.changeUserEmail(
          SOME_GUID,
          SOME_BODY,
          SOME_JWT,
          SOME_USER_AGENT,
          SOME_IP,
        ),
      ).rejects.toThrowError(new UserNotFoundException(SOME_GUID));
    });

    it('should throw UserPasswordIncorrectException case identity manager return 401', async () => {
      httpService.post.mockReturnValueOnce(
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
      await expect(
        identityManagerClientService.changeUserEmail(
          SOME_GUID,
          SOME_BODY,
          SOME_JWT,
          SOME_USER_AGENT,
          SOME_IP,
        ),
      ).rejects.toThrowError(new UserPasswordIncorrectException());
    });

    it('should throw UserSameEmailException case identity manager return 400 with respective message', async () => {
      httpService.post.mockReturnValueOnce(
        throwError(
          () =>
            ({
              response: {
                data: {
                  message: 'Current user email is the same from request',
                },
                status: 400,
              },
            } as AxiosError),
        ),
      );
      await expect(
        identityManagerClientService.changeUserEmail(
          SOME_GUID,
          SOME_BODY,
          SOME_JWT,
          SOME_USER_AGENT,
          SOME_IP,
        ),
      ).rejects.toThrowError(new UserSameEmailException());
    });
  });
});
