import { Query, Resolver } from '@nestjs/graphql';
import { RoleService } from './role.service';
import { RoleFieldMap, AssignedRoleGrid } from './dto/role.type';
import { Role } from '@boxedout-libs/db-boxedoutAdmin/entities/role.entity';
import { Auth } from '@boxedout/auth/auth.decorator';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { AgGridArgs } from '@nestjs-yalc/ag-grid/ag-grid-args.decorator';
import { AgGridInterceptor } from '@nestjs-yalc/ag-grid/ag-grid.interceptor';
import { UseInterceptors } from '@nestjs/common';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';

@Resolver()
export class RoleResolver {
  constructor(private roleService: RoleService) {}

  @Auth([RoleEnum.MANAGEMENT])
  @UseInterceptors(new AgGridInterceptor())
  @Query(returnValue(AssignedRoleGrid), {
    description:
      'Role: management. Get all user <-> role combinations for employees. This information can be used to view all roles for an employee, or list all employees with a role.',
  })
  public async ManageUser_getAssignedRoleGrid(
    @AgGridArgs({
      fieldMap: RoleFieldMap,
    })
    findOptions: AgGridFindManyOptions,
  ): Promise<[Role[], number]> {
    return this.roleService.getEntityListAgGrid(findOptions, true);
  }
}

/**
 * This is used only to upload the RoleEnum in the GraphqlSchema
 */
@Resolver(() => RoleEnum)
export class RoleEnumResolver {
  @Auth([RoleEnum.SUPER_USER])
  @Query(returnValue([RoleEnum]), {
    description:
      'This is used only to upload the RoleEnum in the GraphqlSchema',
  })
  public ManageUser_getRoleEnum() {
    return Object.values(RoleEnum);
  }
}
