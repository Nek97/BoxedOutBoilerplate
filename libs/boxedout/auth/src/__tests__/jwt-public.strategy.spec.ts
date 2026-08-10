jest.mock('@nestjs/config');

import { JwtPublicStrategy, jwtExtractor } from '../jwt-public.strategy';
import * as NestConfig from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { AuthService } from '@boxedout/auth/auth.service';
import { AudienceEnum } from '../jwt-private.strategy';

const mockedNestConfig = NestConfig as jest.Mocked<typeof NestConfig>;

const mockCallback = () => {
  return 'passed';
};

const testFullDataExtractor = {
  expectedRes: 'validated',
  mockedRequest: {
    headers: { cookie: '__Secure-JWT=validated' },
  },
};
const testMobileExtractor = {
  expectedRes: 'validated',
  mockedRequest: {
    headers: { cookie: 'Mobile=validated' },
  },
};
const testPartialDataExtractor = {
  expectedRes: mockCallback(),
  mockedRequest: {},
};
const testNoDataExtractor = {
  expectedRes: mockCallback(),
  mockedRequest: null,
};

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

describe('Jwt extractor test', () => {
  const mockConfigService = (mockedNestConfig.ConfigService = jest.fn());
  const defaultConfigService = () =>
    mockConfigService.mockImplementation(() => ({
      get: jest.fn().mockReturnValue({
        isDev: true,
        jwtSecretPublic: 'jwtSecretExpected',
      }),
    }));
  const jwtExtractorReturnFunction = jwtExtractor(mockCallback, true);
  const jwtExtractorReturnFunctionNotInDev = jwtExtractor(mockCallback, false);

  expect(jwtExtractorReturnFunction).toBeDefined();
  expect(jwtExtractorReturnFunctionNotInDev).toBeDefined();

  it('Jwt extractor fulled case', async () => {
    const testedExtractor = jwtExtractorReturnFunction(
      testFullDataExtractor.mockedRequest,
    );
    expect(testedExtractor).toEqual(testFullDataExtractor.expectedRes);
  });

  it('Jwt extractor Mobile case', async () => {
    const testedExtractor = jwtExtractorReturnFunction(
      testMobileExtractor.mockedRequest,
    );
    expect(testedExtractor).toEqual(testMobileExtractor.expectedRes);
  });

  it('Jwt extractor not in dev', async () => {
    const testedExtractor = jwtExtractorReturnFunctionNotInDev(
      testFullDataExtractor.mockedRequest,
    );
    expect(testedExtractor).toEqual(testFullDataExtractor.expectedRes);
    defaultConfigService();
  });

  it('Jwt extractor without cookies data', async () => {
    const testedExtractor = jwtExtractorReturnFunction(
      testPartialDataExtractor.mockedRequest,
    );
    expect(testedExtractor).toEqual(testPartialDataExtractor.expectedRes);
  });

  it('Jwt extractor without request data', async () => {
    const testedExtractor = jwtExtractorReturnFunction(
      testNoDataExtractor.mockedRequest,
    );
    expect(testedExtractor).toEqual(testNoDataExtractor.expectedRes);
  });

  describe('Jwt strategy test', () => {
    const mockAuthService = createMock<AuthService>();

    it('Jwt Strategy creation', async () => {
      const jwtExtractorReturnFunction = new JwtPublicStrategy({
        jwtSecretPublic: 'publicsecret',
      });
      expect(jwtExtractorReturnFunction).toBeDefined();
    });

    it('Jwt Strategy validate', async () => {
      mockAuthService.validatePayload.mockResolvedValue(
        testDataStrategy.expectedRes,
      );
      const jwtExtractorReturnFunction = new JwtPublicStrategy({
        jwtSecretPublic: 'publicsecret',
      });
      const validation = jwtExtractorReturnFunction.validate(
        testDataStrategy.mockedUser,
      );

      expect(await validation).toEqual(testDataStrategy.expectedRes);
    });
    it('Jwt Strategy success', async () => {
      mockAuthService.validatePayload.mockResolvedValue(
        testDataStrategy.expectedRes,
      );
      const jwtExtractorReturnFunction = new JwtPublicStrategy({
        jwtSecretPublic: 'publicsecret',
      });
      jwtExtractorReturnFunction.error();
      const testSucc = jwtExtractorReturnFunction.success(
        testDataStrategy.mockedUser,
      );

      expect(testSucc).toEqual(testDataStrategy.mockedUser);
    });
    it('Jwt Strategy error', async () => {
      mockAuthService.validatePayload.mockResolvedValue(
        testDataStrategy.expectedRes,
      );
    });
  });
});
