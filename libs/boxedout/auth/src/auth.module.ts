// @ts-nocheck
import {
  DynamicModule,
  Global,
  Module,
  ModuleMetadata,
  Provider,
  Type,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtPrivateStrategy } from './jwt-private.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtPublicStrategy } from './jwt-public.strategy';
import { ImportType } from '@nestjs-yalc/interfaces/nestjs.type';
import {
  UserService,
  UserServiceFactory,
} from '@boxedout/manage-user/user.service';
import { User } from '@boxedout-libs/db-boxedout/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveSession } from '@boxedout-libs/db-boxedout/entities/active-session.entity';
import { Role } from '@boxedout-libs/db-boxedoutAdmin/entities/role.entity';
import {
  RoleService,
  RoleServiceFactory,
} from '@boxedout/manage-user/role.service';
import {
  UserEmailService,
  UserEmailServiceFactory,
} from '@boxedout/manage-user/user-email.service';
import { UserEmail } from '@boxedout-libs/db-boxedout/entities/user-email.entity';
import {
  AllowedIpService,
  AllowedIpServiceFactory,
} from '@boxedout/manage-monitor/allowed-ip.service';
import { AllowedIp } from '@boxedout-libs/db-boxedoutAdmin/entities/allowed-ip.entity';
import { LoginResolver } from './login.resolver';
import { SelfUserResolver } from './self-user.resolver';
import { IAuthModuleOptions } from './auth.type';
import { LoginController } from './login.controller';
import { JwtAuth0Strategy } from '@boxedout/auth/jwt-auth0.strategy';

interface IAuthModuleOptionsFactory {
  createMassiveConnectOptions():
    | Promise<IAuthModuleOptions>
    | IAuthModuleOptions;
}

export interface IAuthModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<IAuthModuleOptionsFactory>;
  useClass?: Type<IAuthModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<IAuthModuleOptions> | IAuthModuleOptions;
}

export interface IAuthModuleRegisterOptions {
  withDbConnection: boolean;
  boxedoutDbConnName: string;
  boxedoutAdminDbConnName: string;
  withResolvers?: boolean;
}

@Global()
@Module({})
export class AuthModule {
  static register(
    registerOptions: IAuthModuleRegisterOptions,
    {
      ignoreJwtExpiration = false,
      jwtSecretPrivate,
      jwtSecretPublic,
      jwtSecretMobile,
      jwtIssuer,
      auth0Config,
      allowLocalhost = false,
      disableRoleCheck = false,
      isTest = false,
      isPipeline = false,
      isProduction = false,
    }: IAuthModuleOptions = {},
  ): DynamicModule {
    return this.createModule(registerOptions, {
      provide: 'CONFIG_OPTIONS',
      useValue: <IAuthModuleOptions>{
        ignoreJwtExpiration,
        jwtSecretPrivate,
        jwtSecretPublic,
        auth0Config,
        jwtSecretMobile,
        jwtIssuer,
        allowLocalhost,
        disableRoleCheck,
        isTest,
        isPipeline,
        isProduction,
        withDbConnection: registerOptions.withDbConnection,
      },
    });
  }

  static registerAsync(
    registerOptions: IAuthModuleRegisterOptions,
    factoryFn: {
      (configService: ConfigService): IAuthModuleOptions;
    },
  ): DynamicModule {
    return this.createModule(registerOptions, {
      provide: 'CONFIG_OPTIONS',
      useFactory: factoryFn,
      inject: [ConfigService],
    });
  }

  private static createModule(
    {
      withDbConnection,
      boxedoutAdminDbConnName,
      boxedoutDbConnName,
      withResolvers,
    }: IAuthModuleRegisterOptions,
    optionProvider: Provider,
  ) {
    const imports: ImportType[] = [
      PassportModule,
      JwtModule.register({
        secret: '', // we don't need the secret
      }),
    ];

    if (withDbConnection) {
      imports.push(
    // @ts-ignore
        TypeOrmModule.forFeature(
          [User, ActiveSession, UserEmail],
          boxedoutDbConnName,
        ),
        TypeOrmModule.forFeature([Role, AllowedIp], boxedoutAdminDbConnName),
      );
    }

    const providers = [
      UserServiceFactory(boxedoutDbConnName),
      RoleServiceFactory(boxedoutAdminDbConnName),
      AuthService,
      JwtPrivateStrategy,
      JwtPublicStrategy,
      JwtAuth0Strategy,
      optionProvider,
      ConfigService,
      AllowedIpServiceFactory(boxedoutAdminDbConnName),
      UserEmailServiceFactory(boxedoutDbConnName),
    ];

    const controllers = [];

    if (withResolvers) {
      providers.push(SelfUserResolver);

      // Since we are migrating the legacy we need to have a login capability
      // used in non-production environments.
      // The current solution running on legacy production environment has multiple
      // authentication (recaptcha, 2fa, etc) steps that it's out of scope for now.
      if (process.env.NODE_ENV !== 'production') {
        providers.push(LoginResolver);
        controllers.push(LoginController);
      }
    }

    return {
      module: AuthModule,
      imports,
      providers,
      exports: [
        AuthService,
        JwtPrivateStrategy,
        JwtPublicStrategy,
        JwtAuth0Strategy,
        RoleService,
        UserEmailService,
        AllowedIpService,
        UserService,
      ],
      controllers,
    };
  }
}
