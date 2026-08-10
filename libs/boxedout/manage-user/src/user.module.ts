import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService, UserServiceFactory } from './user.service';
import { UserResolver, UserSelfResolver } from './user.resolver';
import { ConfigService } from '@nestjs/config';
import { UserRepository, ActiveSessionRepository } from '@boxedout-libs/db-boxedout/boxedout.repository';
import { RoleService, RoleServiceFactory } from './role.service';
import { RoleEnumResolver, RoleResolver } from './role.resolver';
import { RoleRepository } from '@boxedout-libs/db-boxedoutAdmin/boxedout-admin.repository';
import { GenericServiceFactory } from '@nestjs-yalc/ag-grid/generic-service.service';
import { User } from '@boxedout-libs/db-boxedout/entities/user.entity';
import { DbConnection } from '@boxedout-libs/shared/db-default.conf';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [UserRepository, ActiveSessionRepository],
      DbConnection.BOXEDOUT,
    ),
    TypeOrmModule.forFeature(
      [RoleRepository],
      DbConnection.BOXEDOUT_ADMIN,
    ),
  ],
  exports: [
    UserService,
    RoleService,
  ],
  providers: [
    GenericServiceFactory(User, 'boxedoutConnection'),
    ConfigService,
    UserResolver,
    UserSelfResolver,
    UserServiceFactory('boxedoutConnection'),
    RoleResolver,
    RoleEnumResolver,
    RoleServiceFactory('boxedoutAdminConnection'),
  ],
})
export class ManageUserModule {}
