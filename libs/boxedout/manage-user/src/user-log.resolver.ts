import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserLogService, UserLogFieldMap } from './user-log.service';
import {
  UserLogExtendedGrid,
  UserLogExtendedType,
  UserLogGrid,
  UserLogType,
} from './dto/user-log.type';
import { UserLog } from '@boxedout-libs/db-boxedout/entities/user-log.entity';
import { UseInterceptors } from '@nestjs/common';
import { Auth } from '@boxedout/auth/auth.decorator';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import {
  AgGridArgs,
  AgGridArgsNoPagination,
} from '@nestjs-yalc/ag-grid/ag-grid-args.decorator';
import { forceFilters } from '@nestjs-yalc/ag-grid/ag-grid.helpers';
import { AgGridInterceptor } from '@nestjs-yalc/ag-grid/ag-grid.interceptor';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { MissingArgumentsError } from '@nestjs-yalc/ag-grid/missing-arguments.error';
import { UUIDScalar } from '@nestjs-yalc/graphql/scalars/uuid.scalar';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { UserDL } from './user-dataloader';
import { UserFieldMap, UserType } from './dto/user.type';
import { User } from '@boxedout-libs/db-boxedout/entities/user.entity';

@Resolver(returnValue(UserLogType))
export class UserLogResolver {
  constructor(private userLogService: UserLogService, private userDL: UserDL) {}

  @Auth([RoleEnum.AGENT])
  @UseInterceptors(new AgGridInterceptor())
  @Query(returnValue(UserLogGrid), {
    description:
      'Role: agent. Get the all logs (most important actions taken on an account) associated with a user.',
  })
  public async ManageUser_getUserLogGridByUserId(
    @AgGridArgs({
      fieldMap: UserLogFieldMap,
    })
    findOptions: AgGridFindManyOptions<UserLog>,
    @Args('userId', { type: returnValue(UUIDScalar) }) userId: string,
  ): Promise<[UserLog[], number]> {
    if (!userId) {
      throw new MissingArgumentsError();
    }
    findOptions.where = forceFilters(
      findOptions.where,
      [{ key: 'userId', value: userId }],
      UserLogFieldMap,
    );
    return this.userLogService.getEntityListAgGrid(findOptions, true);
  }

  @Auth([RoleEnum.AUDIT_USER])
  @UseInterceptors(new AgGridInterceptor())
  @Query(returnValue(UserLogGrid), {
    description:
      'Role: audit-user. Get all the logs for either a certain IP or certain device.',
  })
  public async ManageUser_getUserLogGridAuditUser(
    @AgGridArgs({
      fieldMap: UserLogFieldMap,
    })
    findOptions: AgGridFindManyOptions<UserLog>,
    @Args('device', { nullable: true }) device?: string,
    @Args('ip', { nullable: true }) ip?: string,
  ): Promise<[UserLog[], number]> {
    if (!device && !ip) {
      throw new MissingArgumentsError();
    }
    findOptions.where = forceFilters(
      findOptions.where,
      [
        { key: 'device', value: device },
        { key: 'ip', value: ip },
      ],
      UserLogFieldMap,
    );
    return this.userLogService.getEntityListAgGrid(findOptions, true);
  }

  @Auth([RoleEnum.AGENT])
  @UseInterceptors(new AgGridInterceptor())
  @Query(returnValue(UserLogExtendedGrid), {
    description:
      'Role: agent. Get the all logs (most important actions taken on an account) associated with a user. This information is enriched by adding the ASN and country of the IP addresses used.',
  })
  public async ManageUser_getUserLogExtendedGrid(
    @AgGridArgs({
      fieldMap: UserLogFieldMap,
    })
    findOptions: AgGridFindManyOptions<UserLogExtendedType>,
    @Args('userId', { type: returnValue(UUIDScalar) }) userId: string,
  ): Promise<[UserLogExtendedType[], number]> {
    if (!userId) {
      throw new MissingArgumentsError();
    }
    findOptions.where = forceFilters(
      findOptions.where,
      [{ key: 'userId', value: userId }],
      UserLogFieldMap,
    );
    return this.userLogService.getUserLogExtendedList(findOptions, true);
  }

  @ResolveField(returnValue(UserType))
  async User(
    @Parent() parent: UserLogType,
    @AgGridArgsNoPagination({
      fieldMap: UserFieldMap,
    })
    findOptions: AgGridFindManyOptions<UserType>,
  ): Promise<User | null> {
    /**@todo return single resource without await*/
    return this.userDL.loadOne(parent.guid, findOptions, false);
  }
}
