import { createMock } from '@golevelup/ts-jest';
import { BaseAppService } from '../app-helpers/base-app.service';
import { ExecutionContext } from '@nestjs/common';
import { LoggerTypeEnum, LogLevelEnum } from '@nestjs-yalc/logger/logger.enum';
import { ConsoleLogger } from '@nestjs-yalc/logger/logger-console.service';
import { AppLoggerFactory } from '@nestjs-yalc/logger/logger.factory';

describe('Base App service test', () => {
  let serviceTest: BaseAppService;
  let spiedLogger;
  beforeEach(async () => {
    const logger = AppLoggerFactory(
      'test',
      [LogLevelEnum.DEBUG],
      LoggerTypeEnum.CONSOLE,
    );
    spiedLogger = jest.spyOn(logger, 'debug');

    serviceTest = new BaseAppService(logger);
  });

  it('should receive the hello world message from getHello', async () => {
    expect(serviceTest.getHello('my-app')).toEqual(
      'Hello World from BoxedOut my-app!',
    );
  });

  it('Check handleBeforeAllRoutes Event default', async () => {
    expect(serviceTest).toBeDefined();
    const payload = createMock<ExecutionContext>();
    const rest = payload.getHandler();
    payload.getHandler.mockReturnValue({
      ...rest,
      name: 'test_Test',
    });
    serviceTest.handleBeforeAllRoutes(payload);

    expect(spiedLogger).toHaveBeenCalledTimes(1);
    expect(spiedLogger).toHaveBeenCalledWith(`Running Handler: test_Test`);
  });

  it('Check handleBeforeAllRoutes Event else', async () => {
    expect(serviceTest).toBeDefined();
    const payload = createMock<ExecutionContext>();
    const rest = payload.getHandler();
    payload.getHandler.mockReturnValue({
      ...rest,
      name: '_service',
    });
    serviceTest.handleBeforeAllRoutes(payload);

    expect(spiedLogger).not.toHaveBeenCalled();
  });

  it('No debug log test', async () => {
    const logger = AppLoggerFactory(
      'test',
      [LogLevelEnum.LOG],
      LoggerTypeEnum.CONSOLE,
    );

    serviceTest = new BaseAppService(logger);
    const payload = createMock<ExecutionContext>();
    payload.getHandler.mockReturnValue({
      name: 'test_Test',
    } as any);
    serviceTest.handleBeforeAllRoutes(payload);

    expect(ConsoleLogger['debug']).toBeUndefined();
  });
});
