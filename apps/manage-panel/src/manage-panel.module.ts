// @ts-nocheck
// this file can be ignored
// during the coverage check because
// it's handled by nestjs
/* istanbul ignore file */

import {
  DynamicModule,
  MiddlewareConsumer,
  //MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ManagePanelController } from './manage-panel.controller';
import { ManageUserModule } from '@boxedout/manage-user/user.module';
import { MANAGE_CONF_ALIAS, ManagePanelConf, regConf } from './config/service';
import { dbConf, injectDbConnections, regDbConf } from './config/database';
import { AuthModule } from '@boxedout/auth/auth.module';
import { AuthMiddlewareDev } from '@boxedout/auth/auth.middleware';
import { ManagePanelResolver } from './manage-panel.resolver';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ManagePanelInterceptor } from './manage-panel.interceptor';
import { FilterScalar } from '@nestjs-yalc/ag-grid/filter.scalar';
import { DbObpsServiceFactory } from '@nestjs-yalc/database/db-ops.service';
import {
  CURAPP_CONF_ALIAS,
  APP_LOGGER_SERVICE,
} from '@boxedout-libs/shared/def.const';
import {
  AppDependencyFactory,
  IAppImportsFactory,
} from '@boxedout-libs/shared/app-helpers/app-imports.factory';
import { ConfigService, registerAs } from '@nestjs/config';
import { UUIDScalar } from '@nestjs-yalc/graphql/scalars/uuid.scalar';
import { AppLoggerService } from '@boxedout-libs/shared/logger/app-logger.service';
import { UserSelfDataType } from '@boxedout/manage-user/dto/user.type';
import { ManagePanelService } from './manage-panel.service';
import { SentryModule } from '@boxedout-libs/sentry';
import { GqlSentryPlugin } from '@boxedout-libs/sentry';
import { SeedServiceFactory } from '@nestjs-yalc/database/seed.service';
import { SkeletonModule } from '@nestjs-yalc/skeleton-module/skeleton.module';
import { SkeletonBoxedOutModule } from '@boxedout/skeleton-boxedout-module';
import { MetricsModule, CacheRateModule } from '@boxedout-libs/modern-infra';

export interface IAppModuleOptions extends IAppImportsFactory {
  setupGraphQL?: boolean;
  setupDatabases?: boolean;
  setupAppModules?: boolean;
  setupControllers?: boolean;
  operationPrefix?: string;
}

@Module({})
export class ManagePanelModule implements NestModule {
  /**
   *
   * For REST API only
   */
  configure(consumer: MiddlewareConsumer) {
    // allow public jwt on this app when used directly in dev environment
    consumer
      .apply(AuthMiddlewareDev)
      .forRoutes({ path: '(.*)', method: RequestMethod.ALL });
  }

  static forRoot(options: IAppModuleOptions = {}): DynamicModule {
    const {
      setupGraphQL = true,
      setupDatabases = true,
      setupAppModules = true,
      setupControllers = true,
    } = options;

    // this object represents the configuration of the current app that can be used
    // by it's child modules, while you can still access to
    // the configuration of the other apps imported here by using their specific aliases
    const curAppConf = registerAs(
      CURAPP_CONF_ALIAS,
      /* istanbul ignore next */
      () => regConf(),
    );

    options.buildSchemaOptions = {};

    if (setupGraphQL) {
      options.buildSchemaOptions.orphanedTypes = [UserSelfDataType];
    }

    options.gqlPlugin = [GqlSentryPlugin];

    const graphqlModules = [
      ManageUserModule,
      ManagePanelModule,
    ];

    const devProviders = [];
    if (process.env.NODE_ENV === 'development' && !process.env.JEST_WORKER_ID) {
      devProviders.push(
        SkeletonModule.register('boxedoutSkeletonConnection'),
        SkeletonBoxedOutModule.register('boxedoutSkeletonConnection'),
      );
      graphqlModules.push(SkeletonModule, SkeletonBoxedOutModule);
    }

    const { imports, providers, exports } = AppDependencyFactory(
      'manage-panel',
      [curAppConf, regConf, ...regDbConf],
      setupDatabases ? dbConf.map((v) => v.connName) : [],
      setupGraphQL ? graphqlModules : [],
      options,
    );

    const LoggerService = AppLoggerService(APP_LOGGER_SERVICE, 'manage-panel');
    if (setupAppModules) {
      imports.push(
        ...devProviders,
        ManageUserModule,
        AuthModule.registerAsync(
          {
            withDbConnection: true,
            boxedoutAdminDbConnName: 'boxedoutAdminConnection',
            boxedoutDbConnName: 'boxedoutConnection',
            withResolvers: false,
          },
          (configService: ConfigService) => {
            const conf = configService.get<ManagePanelConf>(MANAGE_CONF_ALIAS);
            const isDev = conf?.isDev;
            return {
              allowLocalhost: isDev,
              disableRoleCheck: isDev,
              ignoreJwtExpiration: isDev,
              jwtIssuer: conf?.jwtIssuer,
              jwtSecretPrivate: conf?.jwtSecretPrivate,
              jwtSecretPublic: conf?.jwtSecretPublic,
              jwtSecretMobile: conf?.jwtSecretMobile,
              isTest: conf?.isTest,
              isPipeline: conf?.isPipeline,
              isProduction: conf?.isProduction,
              auth0Config: conf?.auth0Config,
            };
          },
        ),
      );
    }

    imports.push(SentryModule, MetricsModule, CacheRateModule);

    providers.push(
      {
        provide: AuthMiddlewareDev,
        // when setupAppModules is false (dry run case),
        // we need to provide a dummy implementation of this module
        useClass: setupAppModules ? AuthMiddlewareDev : class Dummy {},
      },
      ManagePanelService,
      FilterScalar,
      UUIDScalar,
      ConfigService,
      LoggerService,
      {
        provide: APP_INTERCEPTOR,
        useClass: ManagePanelInterceptor,
      },
      {
        provide: APP_GUARD,
        useClass: ThrottlerGuard,
      },
    );

    if (setupAppModules) {
      providers.push(ManagePanelResolver);
    }

    if (setupDatabases) {
      providers.push(
        DbObpsServiceFactory(APP_LOGGER_SERVICE, injectDbConnections),
        SeedServiceFactory(
          `${__dirname}/config/`,
          APP_LOGGER_SERVICE,
          injectDbConnections,
        ),
      );
    }

    let controllers;

    if (setupControllers) {
      controllers = [ManagePanelController];
    }

    return {
      module: ManagePanelModule,
      providers,
      exports: [...exports, ConfigService, LoggerService],
      imports,
      controllers,
    };
  }
}
