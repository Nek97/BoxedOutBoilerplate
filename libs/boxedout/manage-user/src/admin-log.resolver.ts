import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { Auth } from '@boxedout/auth/auth.decorator';
import {
  AgGridArgs,
  AgGridArgsNoPagination,
} from '@nestjs-yalc/ag-grid/ag-grid-args.decorator';
import { forceFilters } from '@nestjs-yalc/ag-grid/ag-grid.helpers';
import { AgGridInterceptor } from '@nestjs-yalc/ag-grid/ag-grid.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { AdminLogService } from './admin-log.service';
import {
  AdminLogFieldMap,
  AdminLogGrid,
  AdminLogType,
} from './dto/admin-log.type';
import { UserFieldMap, UserType } from './dto/user.type';
import { UserDL } from './user-dataloader';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { MissingArgumentsError } from '@nestjs-yalc/ag-grid/missing-arguments.error';
import { UUIDScalar } from '@nestjs-yalc/graphql/scalars/uuid.scalar';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { User } from '@boxedout-libs/db-boxedout/entities/user.entity';
import { FindAndCountResult } from '@nestjs-yalc/database/query-builder.helper';

@Resolver(returnValue(AdminLogType))
export class AdminLogResolver {
  constructor(
    private adminLogService: AdminLogService,
    private userDL: UserDL,
  ) {}

  /**
   * @param findOptions ParamDecorator that maps the AgQueryParams input type to the FindManyOptions for our service
   */
  @Auth([RoleEnum.MANAGEMENT])
  @UseInterceptors(new AgGridInterceptor())
  @Query(returnValue(AdminLogGrid), {
    description:
      'Role: management. Get all v1 manage panel actions performed by an employee.',
  })
  public async ManageUser_getAdminLogGridByAdminId(
    @AgGridArgs({
      fieldMap: AdminLogFieldMap,
    })
    findOptions: AgGridFindManyOptions<AdminLogType>,
    @Args('adminId') adminId: string,
  ): Promise<[AdminLogType[], number]> {
    if (!adminId) {
      throw new MissingArgumentsError();
    }
    findOptions.where = forceFilters(
      findOptions.where,
      [{ key: 'adminId', value: adminId }],
      AdminLogFieldMap,
    );
    return this.adminLogService.getEntityListAgGrid(findOptions, true);
  }

  @Auth([RoleEnum.AGENT])
  @UseInterceptors(new AgGridInterceptor())
  @Query(returnValue(AdminLogGrid), {
    description:
      'Role: agent. Get all v1 manage panel actions performed on a certain user.',
  })
  public async ManageUser_getAdminLogGridByUserId(
    @AgGridArgs({
      fieldMap: AdminLogFieldMap,
    })
    findOptions: AgGridFindManyOptions<AdminLogType>,
    @Args('userId', { type: returnValue(UUIDScalar) })
    userId: string,
  ): Promise<[AdminLogType[], number]> {
    if (!userId) {
      throw new MissingArgumentsError();
    }
    findOptions.where = forceFilters(
      findOptions.where,
      [{ key: 'userId', value: userId }],
      AdminLogFieldMap,
    );
    return this.adminLogService.getEntityListAgGrid(findOptions, true);
  }

  @ResolveField(returnValue([UserType]))
  async User(
    @Parent() adminLog: AdminLogType,
    @AgGridArgsNoPagination({
      fieldMap: UserFieldMap,
    })
    findOptions: AgGridFindManyOptions<UserType>,
  ): Promise<FindAndCountResult<User>> {
    /**@todo return single resource */
    return this.userDL.loadOneToMany(adminLog.target, findOptions);
  }

  @ResolveField(returnValue([UserType]))
  async Admin(
    @Parent() adminLog: AdminLogType,
    @AgGridArgsNoPagination({
      fieldMap: UserFieldMap,
    })
    findOptions: AgGridFindManyOptions<UserType>,
  ): Promise<FindAndCountResult<User>> {
    /**@todo return single resource */
    return this.userDL.loadOneToMany(adminLog.guid, findOptions);
  }
}
