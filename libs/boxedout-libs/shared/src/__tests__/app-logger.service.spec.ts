import { APP_LOGGER_SERVICE } from '../def.const';
import { AppLoggerService } from '../logger/app-logger.service';

describe(`Test AppLoggerService`, () => {
  beforeEach(() => {
    jest.mock('@nestjs-yalc/logger/logger.factory');
  });

  it('should run the factory function', async () => {
    // without conf
    await AppLoggerService(APP_LOGGER_SERVICE, 'test').useFactory({
      get: jest.fn(),
    } as any);

    // with conf
    await AppLoggerService(APP_LOGGER_SERVICE, 'test').useFactory({
      get: () => ({ loggerType: 'pino', logLevels: ['debug'] }),
    } as any);
  });
});
