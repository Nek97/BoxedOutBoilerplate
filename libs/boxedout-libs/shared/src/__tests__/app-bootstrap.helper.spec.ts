import { createMock } from '@golevelup/ts-jest';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppBootstrap } from '../app-helpers/app-bootstrap.helper';
import { APP_LOGGER_SERVICE } from '../def.const';
import { GqlExceptionFilter } from '@nestjs/graphql';

jest.mock('@nestjs/swagger', () => ({
  ...jest.requireActual('@nestjs/swagger'),
  SwaggerModule: createMock<SwaggerModule>(),
  // DocumentBuilder: createMock<DocumentBuilder>(),
}));

import type { SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [registerAs('test', () => null)],
    }),
  ],
  providers: [
    ConfigService,
    {
      provide: APP_LOGGER_SERVICE,
      useFactory: () => null,
    },
  ],
})
class DummyModule {
  static forRoot(): DynamicModule {
    return {
      module: DummyModule,
    };
  }
}

describe('Test AppBootstrap', () => {
  let appBootstrap: AppBootstrap;
  beforeEach(() => {
    appBootstrap = new AppBootstrap('test', 'test', DummyModule.forRoot());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(appBootstrap).toBeDefined();
  });

  it('should create the app', async () => {
    await appBootstrap.createApp();

    const app = appBootstrap.getApp();

    expect(app).toBeDefined();

    // also check if setApp works
    appBootstrap.setApp(app);

    expect(appBootstrap.getApp() === app).toBeTruthy();
  });

  it('should getConf correctly', async () => {
    await appBootstrap.createApp();
    expect(appBootstrap.getConf()).toBeDefined();
  });

  it('should getModule correctly', async () => {
    await appBootstrap.createApp();
    expect(appBootstrap.getModule()).toBeDefined();
  });

  it('should applyBootstrapGlobals correctly', async () => {
    await appBootstrap.createApp();
    expect(appBootstrap.applyBootstrapGlobals()).toStrictEqual(appBootstrap);
  });

  it('should applyBootstrapGlobals with options', async () => {
    await appBootstrap.createApp();
    expect(
      appBootstrap.applyBootstrapGlobals({
        apiPrefix: '',
        filters: [{} as GqlExceptionFilter],
      }),
    ).toStrictEqual(appBootstrap);
  });

  it('should applyBootstrapGlobals throw an error', async () => {
    expect(() => appBootstrap.applyBootstrapGlobals()).toThrowError(
      'The app must be created first',
    );
  });

  it('should listen correctly', async () => {
    const createAppMock = jest.spyOn(NestFactory, 'create');

    const mockedListen = jest.fn((_a: any, _b: any, callback: any) =>
      callback(),
    );

    createAppMock.mockImplementation(
      async () =>
        ({ listen: mockedListen, get: () => ({ get: jest.fn() }) } as any),
    );

    await appBootstrap.createApp();

    await appBootstrap.listen();

    expect(mockedListen).toHaveBeenCalledTimes(1);
  });

  it('should listen with conf', async () => {
    const spiedConf = jest.spyOn(appBootstrap, 'getConf');
    spiedConf.mockReturnValue({
      port: 1,
      host: '',
      domain: '',
      apiPrefix: 'dev',
    } as any);

    const nestApp = createMock<NestFastifyApplication>();

    const mockedListen = jest.fn((_a: any, _b: any, callback: any) =>
      callback(),
    );

    nestApp.listen.mockImplementation(mockedListen);

    await appBootstrap
      .setApp(nestApp)
      .applyBootstrapGlobals()
      .listen(() => {});

    expect(mockedListen).toHaveBeenCalledTimes(1);
  });
});
