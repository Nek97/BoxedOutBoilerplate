// @ts-nocheck
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { makeSentryService, SentryModule } from '../sentry.module';
import { SentryService } from '../sentry.service';

jest.mock('../sentry.service');

describe('SentryModule', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('Should be defined', async () => {
    const module = new SentryModule();
    expect(module).toBeDefined();
  });

  it('It should provide SentrySerivice from a ConfigService', async () => {
    const sentryModuleConf = {
      sentryOptions: {
        dns: 'http://fakedns.net',
      },
    };

    const mockedConfig = createMock<ConfigService>();
    mockedConfig.get.mockReturnValue({
      sentryModuleConf,
    });
    await makeSentryService(mockedConfig);
    expect(SentryService).toHaveBeenCalledWith(sentryModuleConf.sentryOptions);
  });

  it('Should not provide SentryService if ConfigService is not set correctly', async () => {
    const mockedConfig = createMock<ConfigService>();
    mockedConfig.get.mockReturnValue({});
    await makeSentryService(mockedConfig);
    expect(SentryService).not.toHaveBeenCalled();
  });
});
