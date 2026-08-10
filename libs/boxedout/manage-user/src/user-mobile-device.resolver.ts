import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserMobileDeviceService } from './user-mobile-device.service';
import {
  UserMobileDeviceFieldMap,
  UserMobileDeviceGrid,
  UserMobileDeviceType,
} from './dto/user-mobile-device.type';
import { UserMobileDevice } from '@boxedout-libs/db-boxedout/entities/user-mobile-device.entity';
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

@Resolver(() => UserMobileDeviceType)
export class UserMobileDeviceResolver {
  constructor(private userMobileDeviceService: UserMobileDeviceService) {}

  @Auth([RoleEnum.AGENT])
  @UseInterceptors(new AgGridInterceptor())
  @Query(returnValue(UserMobileDeviceGrid), {
    description:
      'Role: agent. Get the all devices that interacted with the app (for browser see userDevice) associated with a user.',
  })
  public async ManageUser_getUserMobileDeviceGrid(
    @AgGridArgs({
      fieldMap: UserMobileDeviceFieldMap,
    })
    findOptions: AgGridFindManyOptions<UserMobileDevice>,
    @Args('userId', { type: returnValue(UUIDScalar) }) userId: string,
  ): Promise<[UserMobileDevice[], number]> {
    if (!userId) {
      throw new MissingArgumentsError();
    }
    findOptions.where = forceFilters(
      findOptions.where,
      [{ key: 'userId', value: userId }],
      UserMobileDeviceFieldMap,
    );
    return this.userMobileDeviceService.getEntityListAgGrid(findOptions, true);
  }
}
