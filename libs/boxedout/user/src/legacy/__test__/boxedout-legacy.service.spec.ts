import { Connection } from 'typeorm';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { PubSubService } from '@boxedout-libs/redis';
import { EmailSenderService } from '@boxedout-libs/shared/emailSender/email-sender.service';
import { BoxedOutLegacyService } from '@boxedout/user/legacy/boxedout-legacy.service';
import { FastifyRequest } from 'fastify';
import {
  IncorrectPasswordError,
  IncorrectTokenError,
  InputValidationError,
  TwoFactorRequiredError,
} from '@boxedout/user/legacy/common.error';
import { encryptString } from '@nestjs-yalc/aws-helpers';
import { getEncMode } from '@boxedout-libs/shared/helpers/aws.helper';
import * as bcrypt from 'bcryptjs';
import { generateToken } from '@boxedout-libs/shared/helpers/two-factor.helper';

describe('BoxedOutLegacyService test', () => {
  let boxedoutConnection: DeepMocked<Connection>;
  let redis: DeepMocked<PubSubService>;
  let emailSenderService: DeepMocked<EmailSenderService>;
  let boxedoutLegacyService: BoxedOutLegacyService;
  const SOME_GUID = '73daa131-532f-4885-9f87-8c2f9977be90';
  const PASSWORD_HASH =
    '$2a$12$RjeAzmwrJuPBp7VVPUOICuqnUixtwej.h9a2IOPR4bMjADg754XzW'; // Hash for 1234

  beforeEach(() => {
    boxedoutConnection = createMock<Connection>();
    redis = createMock<PubSubService>();
    emailSenderService = createMock<EmailSenderService>();
    boxedoutLegacyService = new BoxedOutLegacyService(
      boxedoutConnection,
      redis,
      emailSenderService,
    );
  });

  describe('changeUserEmail', () => {
    const SOME_EMAIL = 'test@test.com';
    const SOME_PASSWORD = '123456';
    const SOME_TWO_FACTOR_KEY = 'some-key';

    it('should throw when user has 2FA enabled and did not inform the 2FA token', async () => {
      const request = { user: { aud: 'website' } } as unknown as FastifyRequest;
      boxedoutConnection.query
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce({ changedRows: 1 })
        .mockResolvedValueOnce([
          {
            password: bcrypt.hashSync(SOME_PASSWORD),
            twoFactor: 1,
            language: 'en',
          },
        ]);
      await expect(
        boxedoutLegacyService.changeUserEmail(SOME_GUID, request, {
          password: SOME_PASSWORD,
          email: SOME_EMAIL,
        }),
      ).rejects.toThrowError(TwoFactorRequiredError);
    });

    it('should throw when user has 2FA enabled and 2FA token is incorrect', async () => {
      const request = { user: { aud: 'website' } } as unknown as FastifyRequest;
      const twoFactorKeyEncrypted = await encryptString(
        SOME_TWO_FACTOR_KEY,
        getEncMode(),
      );
      boxedoutConnection.query
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce({ changedRows: 1 })
        .mockResolvedValueOnce([
          {
            password: bcrypt.hashSync(SOME_PASSWORD),
            twoFactor: 1,
            language: 'en',
          },
        ])
        .mockResolvedValueOnce([
          {
            twoFactorKey: twoFactorKeyEncrypted,
            twoFactorLatest: 'AAAA',
          },
        ]);
      await expect(
        boxedoutLegacyService.changeUserEmail(SOME_GUID, request, {
          password: SOME_PASSWORD,
          email: SOME_EMAIL,
          twoFactor: 'dsdsds',
        }),
      ).rejects.toThrowError(IncorrectTokenError);
    });

    it('should throw when user inform a wrong password', async () => {
      const request = { user: { aud: 'website' } } as unknown as FastifyRequest;
      boxedoutConnection.query
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce({ changedRows: 1 })
        .mockResolvedValueOnce([
          {
            password: bcrypt.hashSync(SOME_PASSWORD),
            twoFactor: 0,
            language: 'en',
          },
        ]);
      await expect(
        boxedoutLegacyService.changeUserEmail(SOME_GUID, request, {
          password: '12345',
          email: SOME_EMAIL,
        }),
      ).rejects.toThrowError(IncorrectPasswordError);
    });

    it('should throw when user inform the same email as the current', async () => {
      const request = { user: { aud: 'website' } } as unknown as FastifyRequest;
      boxedoutConnection.query
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce({ changedRows: 1 })
        .mockResolvedValueOnce([
          {
            password: bcrypt.hashSync(SOME_PASSWORD),
            twoFactor: 0,
            language: 'en',
          },
        ])
        .mockResolvedValueOnce([
          {
            email: SOME_EMAIL,
          },
        ]);
      await expect(
        boxedoutLegacyService.changeUserEmail(SOME_GUID, request, {
          password: SOME_PASSWORD,
          email: SOME_EMAIL,
        }),
      ).rejects.toThrowError(new InputValidationError('same_email'));
    });

    it('should update email successfully with 2FA enabled', async () => {
      const request = {
        user: { aud: 'website' },
        headers: [],
      } as unknown as FastifyRequest;
      const twoFactorKeyEncrypted = await encryptString(
        SOME_TWO_FACTOR_KEY,
        getEncMode(),
      );
      const twoFactorToken = generateToken(SOME_TWO_FACTOR_KEY);
      boxedoutConnection.query
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce({ changedRows: 1 })
        .mockResolvedValueOnce([
          {
            password: bcrypt.hashSync(SOME_PASSWORD),
            twoFactor: 1,
            language: 'en',
          },
        ])
        .mockResolvedValueOnce([
          {
            twoFactorKey: twoFactorKeyEncrypted,
            twoFactorLatest: 'AAAA',
          },
        ]);
      await expect(
        boxedoutLegacyService.changeUserEmail(SOME_GUID, request, {
          password: SOME_PASSWORD,
          email: SOME_EMAIL,
          twoFactor: twoFactorToken,
        }),
      ).resolves.toBeUndefined();
      expect(emailSenderService.sendEmail).toHaveBeenCalledTimes(2);
    });

    it('should update email successfully without 2FA enabled', async () => {
      const request = {
        user: { aud: 'website' },
        headers: [],
      } as unknown as FastifyRequest;
      boxedoutConnection.query
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce({ changedRows: 1 })
        .mockResolvedValueOnce([
          {
            password: bcrypt.hashSync(SOME_PASSWORD),
            twoFactor: 0,
            language: 'en',
          },
        ]);
      await expect(
        boxedoutLegacyService.changeUserEmail(SOME_GUID, request, {
          password: SOME_PASSWORD,
          email: SOME_EMAIL,
        }),
      ).resolves.toBeUndefined();
      expect(emailSenderService.sendEmail).toHaveBeenCalledTimes(2);
    });
  });

  describe('changeUserPassword', () => {
    it('should throw when user inform a wrong password', async () => {
      const request = { user: { aud: 'website' } } as unknown as FastifyRequest;
      boxedoutConnection.query
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce({ changedRows: 1 })
        .mockResolvedValueOnce([{ password: PASSWORD_HASH }]);
      await expect(
        boxedoutLegacyService.changeUserPassword(SOME_GUID, request, {
          password_current: '4321',
          password_new1: '123456',
          password_new2: '123456',
        }),
      ).rejects.toThrowError(
        new IncorrectPasswordError('current_password_incorrect'),
      );
    });

    it('should update password when request is OK', async () => {
      const request = {
        user: { aud: 'website' },
        headers: { 'user-agent': 'Chrome' },
      } as unknown as FastifyRequest;
      boxedoutConnection.query
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce({ changedRows: 1 })
        .mockResolvedValueOnce([{ password: PASSWORD_HASH }]);
      await boxedoutLegacyService.changeUserPassword(SOME_GUID, request, {
        password_current: '1234',
        password_new1: '123456',
        password_new2: '123456',
      });
      expect(emailSenderService.sendEmail).toHaveBeenCalled();
      expect(boxedoutConnection.query).toHaveBeenCalledTimes(8);
    });
  });
});
