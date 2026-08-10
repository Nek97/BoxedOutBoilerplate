import { createMock } from '@golevelup/ts-jest';
import { TypeORMLogger } from '@nestjs-yalc/logger/typeorm-logger';
import { FactoryProvider, LoggerService } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppLoggerModule } from '../logger/app-logger.module';

describe(`Test ${AppLoggerModule.name}`, () => {
  it('should create the module', () => {
    const module = AppLoggerModule.forRoot('context', {
      module: ConfigModule,
    });
    expect(module).toBeInstanceOf(Object);

    // check typeorm logger creation
    const factoryProvider: FactoryProvider = module.providers[0] as any;
    const logger = factoryProvider.useFactory(
      createMock<LoggerService>(),
      createMock<EventEmitter2>(),
    );
    expect(logger).toBeInstanceOf(TypeORMLogger);
  });
});
