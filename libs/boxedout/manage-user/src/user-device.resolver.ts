import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserDeviceService } from './user-device.service';
import { UserDeviceFieldMap, UserDeviceGrid } from './dto/user-device.type';
import { UserDevice } from '@boxedout-libs/db-boxedout/entities/user-device.entity';
import { Auth } from '@boxedout/auth/auth.decorator';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { AgGridArgs } from '@nestjs-yalc/ag-grid/ag-grid-args.decorator';
import { UseInterceptors } from '@nestjs/common';
import { AgGridInterceptor } from '@nestjs-yalc/ag-grid/ag-grid.interceptor';
import { forceFilters } from '@nestjs-yalc/ag-grid/ag-grid.helpers';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { MissingArgumentsError } from '@nestjs-yalc/ag-grid/missing-arguments.error';
import { UUIDScalar } from '@nestjs-yalc/graphql/scalars/uuid.scalar';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';

@Resolver()
export class UserDeviceResolver {
  constructor(private userDeviceService: UserDeviceService) {}

  @Auth([RoleEnum.AGENT])
  @UseInterceptors(new AgGridInterceptor())
  @Query(returnValue(UserDeviceGrid), {
    description:
      'Role: agent. Get the all devices that interacted with the web application (for app see userMobileDevice) associated with a user.',
  })
  public async ManageUser_getUserDeviceGrid(
    @AgGridArgs({
      fieldMap: UserDeviceFieldMap,
    })
    findOptions: AgGridFindManyOptions<UserDevice>,
    @Args('userId', { type: returnValue(UUIDScalar) }) userId: string,
  ): Promise<[UserDevice[], number]> {
    if (!userId) {
      throw new MissingArgumentsError();
    }
    findOptions.where = forceFilters(
      findOptions.where,
      [{ key: 'userId', value: userId }],
      UserDeviceFieldMap,
    );
    return this.userDeviceService.getEntityListAgGrid(findOptions, true);
  }
}
