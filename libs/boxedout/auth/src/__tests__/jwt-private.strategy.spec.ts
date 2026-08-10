jest.mock('@nestjs/config');

import { AudienceEnum, JwtPrivateStrategy } from '../jwt-private.strategy';
import * as NestConfig from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { AuthService } from '@boxedout/auth/auth.service';
import { defaultAuthOptions } from '../__mocks__/auth.module.mock';

const mockedNestConfig = NestConfig as jest.Mocked<typeof NestConfig>;

const testDataStrategy = {
  expectedRes: {
    id: 'idPassed',
    aud: AudienceEnum.MOBILE,
    sessionId: 'passed',
    ip: 'passed',
    userId: 'passed',
  },
  mockedUser: {
    id: 'idPassed',
    aud: AudienceEnum.MOBILE,
    sessionId: 'passed',
    ip: 'passed',
    userId: 'passed',
  },
};

describe('Jwt Private strategy test', () => {
  const mockConfigService = (mockedNestConfig.ConfigService = jest.fn());
  mockConfigService.mockImplementation(() => ({
    get: jest.fn().mockReturnValue({
      isDev: true,
      jwtSecretPrivate: 'jwtSecretExpectedPvt',
      jwtSecretPublic: 'jwtSecretExpectedPub',
      jwtSecretMobile: 'jwtSecretExpectedMob',
    }),
  }));
  const mockAuthService = createMock<AuthService>();

  it('Jwt Private Strategy creation', async () => {
    const testData = new JwtPrivateStrategy(
      mockAuthService,
      defaultAuthOptions,
    );
    expect(testData).toBeDefined();
  });

  it('Jwt Private Strategy validate', async () => {
    mockAuthService.validatePrivatePayload.mockReturnValue(
      testDataStrategy.expectedRes,
    );
    const testData = new JwtPrivateStrategy(
      mockAuthService,
      defaultAuthOptions,
    );
    const validationFn = testData.validate(testDataStrategy.mockedUser);

    expect(validationFn).toBeDefined();
  });
});
