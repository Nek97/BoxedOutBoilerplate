import { ManagePanelService } from '../manage-panel.service';
import { LoggerTypeEnum, LogLevelEnum } from '@nestjs-yalc/logger/logger.enum';
import { AppLoggerFactory } from '@nestjs-yalc/logger/logger.factory';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AuthMiddlewareDev } from '@boxedout/auth/auth.middleware';

describe('App service test', () => {
  let serviceTest: ManagePanelService;
  let authMiddlewareDevMock: DeepMocked<AuthMiddlewareDev>;
  beforeEach(async () => {
    const logger = AppLoggerFactory(
      'test',
      [LogLevelEnum.DEBUG],
      LoggerTypeEnum.CONSOLE,
    );

    authMiddlewareDevMock = createMock<AuthMiddlewareDev>();

    serviceTest = new ManagePanelService(logger, authMiddlewareDevMock);
  });

  it('Check handleAfterUserValidation Event', async () => {
    await serviceTest.handleBeforeGqlContextMiddleware({}, {});

    expect(authMiddlewareDevMock.use).toHaveBeenCalledTimes(1);
  });
});
