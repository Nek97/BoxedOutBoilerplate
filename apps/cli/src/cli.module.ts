import { DynamicModule, Logger, Module } from '@nestjs/common';
import { SeedServiceFactory } from '@nestjs-yalc/database/seed.service';
import { DbObpsServiceFactory } from '@nestjs-yalc/database/db-ops.service';
import {
  CURAPP_CONF_ALIAS,
  APP_LOGGER_SERVICE,
  ProjectsEnum,
} from '@boxedout-libs/shared/def.const';
import { AppDependencyFactory } from '@boxedout-libs/shared/app-helpers/app-imports.factory';
import { AppLoggerService } from '@boxedout-libs/shared/logger/app-logger.service';
import { dbConf, regDbConf, injectDbConnections } from './config/database';
import { regConf as manageConf } from '@boxedout-app/manage-panel/config/service';
import { regConf as cliConf } from './config/service';
import { registerAs } from '@nestjs/config';

export interface ICliOptions {
  keepDBConnectionAlive?: boolean;
  project?: string;
  commandName?: string;
  envPath?: string | string[];
  seedOrmConfigPath?: string;
}

export function CliProvidersFactory(seedOrmConfigPath?: string) {
  return [
    DbObpsServiceFactory(APP_LOGGER_SERVICE, injectDbConnections),
    SeedServiceFactory(
      seedOrmConfigPath ?? `${__dirname}/config/`,
      APP_LOGGER_SERVICE,
      injectDbConnections,
    ),
  ];
}

@Module({})
export class CliModule {
  static forRoot({
    keepDBConnectionAlive = false,
    commandName = 'unknown',
    project = ProjectsEnum.MANAGE_PANEL,
    envPath,
    seedOrmConfigPath,
  }: ICliOptions = {}): DynamicModule {
    Logger.log(`Running: ${commandName}`);

    const confs: any[] = [];
    const dbConn: string[] = [];

    // this object represents the configuration of the current app that can be used
    // by it's child modules, while you can still access to
    // the configuration of the other apps imported here by using their specific aliases
    const curAppConf = registerAs(
      CURAPP_CONF_ALIAS,
      /* istanbul ignore next */
      () => cliConf(),
    );

    dbConf.map((v) => dbConn.push(v.connName));
    confs.push(curAppConf, cliConf, ...regDbConf);

    switch (project) {
      case ProjectsEnum.MANAGE_PANEL:
        confs.push(manageConf);
        break;
    }

    const { imports, providers } = AppDependencyFactory(
      'cli',
      confs,
      dbConn,
      [],
      {
        setupJwt: false,
        keepDBConnectionAlive,
        envPath,
      },
    );

    providers.push(
      AppLoggerService(APP_LOGGER_SERVICE, 'cli'),
      ...CliProvidersFactory(seedOrmConfigPath),
    );

    return {
      module: CliModule,
      global: true,
      providers,
      imports,
      exports: [APP_LOGGER_SERVICE],
    };
  }
}
