// this file can be ignored
// during the coverage check because
// it's handled by nestjs
/* istanbul ignore file */

import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserProviderController } from './user-provider.controller';
import { UserProviderService } from './user-provider.service';
import { AUTH_CONF_ALIAS, UserProviderConf, regConf } from './config/service';
import { getDbConf, injectDbConnections, regDbConf } from './config/database';
import { AuthModule } from '@boxedout/auth/auth.module';
import { UserModule } from '@boxedout/user/user.module';
import { AuthMiddlewareDev } from '@boxedout/auth/auth.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserProviderInterceptor } from './user-provider.interceptor';
import { LoginInterceptor } from '@boxedout/auth/login.interceptor';
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
import { SeedServiceFactory } from '@nestjs-yalc/database/seed.service';
import { DbConnection } from '@boxedout-libs/shared/db-default.conf';

export interface IAppModuleOptions extends IAppImportsFactory {
  setupGraphQL?: boolean;
  setupDatabases?: boolean;
  setupAppModules?: boolean;
  setupControllers?: boolean;
  operationPrefix?: string;
  /**
   * @property onlyAuth if true the App will use only the modules needed for the login functionality
   */
  onlyAuth?: boolean;
}

@Module({})
export class UserProviderModule implements NestModule {
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
      onlyAuth = false,
    } = options;

    // this object represents the configuration of the current app that can be used
    // by it's child modules, while you can still access to
    // the configuration of the other apps imported here by using their specific aliases
    const curAppConf = registerAs(
      CURAPP_CONF_ALIAS,
      /* istanbul ignore next */
      () => regConf(),
    );

    const modulesGql: any[] = [UserProviderModule, AuthModule];
    if (!onlyAuth) {
      modulesGql.push(UserModule);
    }

    const { imports, providers } = AppDependencyFactory(
      'user-provider',
      [curAppConf, regConf, ...regDbConf(onlyAuth)],
      setupDatabases ? getDbConf(onlyAuth).map((v) => v.connName) : [],
      setupGraphQL ? modulesGql : [],
      options,
    );

    const LoggerService = AppLoggerService(APP_LOGGER_SERVICE, 'user-provider');

    const connPrefix = onlyAuth ? 'userprovider_' : '';

    if (setupAppModules) {
      if (!onlyAuth) {
        imports.push(UserModule);
      }
      imports.push(
        AuthModule.registerAsync(
          {
            withDbConnection: true,
            boxedoutAdminDbConnName: `${connPrefix}${DbConnection.BOXEDOUT_ADMIN}`,
            boxedoutDbConnName: `${connPrefix}${DbConnection.BOXEDOUT}`,
            withResolvers: true,
          },
          (configService: ConfigService) => {
            const conf = configService.get<UserProviderConf>(AUTH_CONF_ALIAS);
            const isDev = conf?.isDev;
            const isTest = conf?.isTest;
            return {
              allowLocalhost: isDev,
              disableRoleCheck: isDev,
              ignoreJwtExpiration: isDev || isTest,
              jwtIssuer: conf?.jwtIssuer,
              jwtSecretPrivate: conf?.jwtSecretPrivate,
              jwtSecretPublic: conf?.jwtSecretPublic,
              isTest: isTest,
              jwtSecretMobile: conf?.jwtSecretMobile,
              isPipeline: conf?.isPipeline,
              isProduction: conf?.isProduction,
              auth0Config: conf?.auth0Config,
            };
          },
        ),
      );
    }

    providers.push(
      {
        provide: AuthMiddlewareDev,
        // when setupAppModules is false (dry run case),
        // we need to provide a dummy implementation of this module
        useClass: setupAppModules ? AuthMiddlewareDev : class Dummy {},
      },
      FilterScalar,
      UUIDScalar,
      ConfigService,
      LoggerService,
      UserProviderService,
      {
        provide: APP_INTERCEPTOR,
        useClass: UserProviderInterceptor,
      },
    );

    if (setupAppModules) {
      // providers.push(UserProviderResolver);
      providers.push({
        provide: APP_INTERCEPTOR,
        useClass: LoginInterceptor,
      });
    }

    if (setupDatabases) {
      providers.push(
        DbObpsServiceFactory(APP_LOGGER_SERVICE, injectDbConnections(onlyAuth)),
        SeedServiceFactory(
          `${__dirname}/config/`,
          APP_LOGGER_SERVICE,
          injectDbConnections(onlyAuth),
        ),
      );
    }

    let controllers;

    if (setupControllers) {
      controllers = [UserProviderController];
    }

    return {
      module: UserProviderModule,
      providers,
      exports: [ConfigService, LoggerService],
      imports,
      controllers,
    };
  }
}
