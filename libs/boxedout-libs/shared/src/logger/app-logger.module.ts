import { TypeORMLogger } from '@nestjs-yalc/logger/typeorm-logger';
import { DynamicModule, Global, LoggerService, Module } from '@nestjs/common';
import { APP_LOGGER_SERVICE } from '../def.const';
import { AppLoggerService } from './app-logger.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Global()
@Module({})
export class AppLoggerModule {
  static forRoot(context: string, configModule: DynamicModule): DynamicModule {
    return {
      module: AppLoggerModule,
      imports: [configModule],
      providers: [
        {
          inject: [APP_LOGGER_SERVICE, EventEmitter2],
          provide: TypeORMLogger,
          useFactory: (
            loggerService: LoggerService,
            eventEmitter: EventEmitter2,
          ) => {
            return new TypeORMLogger(loggerService, eventEmitter);
          },
        },
        AppLoggerService(APP_LOGGER_SERVICE, context),
      ],
      exports: [TypeORMLogger, APP_LOGGER_SERVICE],
    };
  }
}
