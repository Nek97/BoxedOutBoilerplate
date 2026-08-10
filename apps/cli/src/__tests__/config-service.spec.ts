import {
  LogLevelEnum,
  LOG_LEVEL_DEFAULT,
} from '@nestjs-yalc/logger/logger.enum';
import { ConfFactory } from '../config/service';
import { envToArray } from '@nestjs-yalc/utils/env.helper';

describe('AppLoggerFactory', () => {
  const OLD_ENV = process.env;

  afterEach(async () => {
    process.env = OLD_ENV;
  });

  it('Should return a proper conf with default log levels', async () => {
    process.env.NEST_LOGGER_LEVELS = `${LogLevelEnum.DEBUG}, ${LogLevelEnum.ERROR}`;
    process.env.API_PREFIX = 'dev';
    process.env.GATEWAY_PORT = '10';
    process.env.NODE_ENV = 'development';
    process.env.CLI_MIGRATION_PAYLOAD = '{}';
    const result = ConfFactory();
    expect(result.apiPrefix).toEqual('dev');
    expect(result.logLevels).toEqual(['debug', 'error']);
    expect(result.port).toStrictEqual(10);
    expect(result.isDev).toEqual(true);
    expect(result.env).toEqual('development');
  });

  it('Should return a proper conf with some fallback defines', async () => {
    delete process.env.NEST_LOGGER_LEVELS;
    delete process.env.GATEWAY_PORT;
    delete process.env.DOMAIN;
    delete process.env.JWT_SECRET_PVT;
    delete process.env.JWT_SECRET_PUB;
    delete process.env.HOST;
    delete process.env.API_PREFIX;
    delete process.env.CLI_MIGRATION_PAYLOAD;
    let result = ConfFactory();

    expect(result.host).toEqual('0.0.0.0');
    expect(result.logLevels).toEqual(LOG_LEVEL_DEFAULT);

    process.env.NEST_LOGGER_LEVELS = '';
    result = ConfFactory();
    expect(result.logLevels).toEqual(LOG_LEVEL_DEFAULT);
  });

  it('Test envToArray', async () => {
    process.env.fakeKey;
    envToArray('fakeKey');
  });
});
