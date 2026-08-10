import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserPhoneService } from './user-phone.service';
import {
  UserPhoneCondition,
  UserPhoneCreateInput,
  UserPhoneFieldMap,
  UserPhoneGrid,
  UserPhoneType,
  UserPhoneUpdateInput,
} from './dto/user-phone.type';
import { UserPhone } from '@boxedout-libs/db-boxedout/entities/user-phone.entity';
import { Auth } from '@boxedout/auth/auth.decorator';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import {
  AgGridArgs,
  AgGridArgsNoPagination,
} from '@nestjs-yalc/ag-grid/ag-grid-args.decorator';
import { UseInterceptors } from '@nestjs/common';
import { AgGridInterceptor } from '@nestjs-yalc/ag-grid/ag-grid.interceptor';
import { InputArgs } from '@nestjs-yalc/ag-grid/gqlmapper.decorator';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { MissingArgumentsError } from '@nestjs-yalc/ag-grid/missing-arguments.error';
import { UUIDScalar } from '@nestjs-yalc/graphql/scalars/uuid.scalar';
import { forceFilters } from '@nestjs-yalc/ag-grid/ag-grid.helpers';
import { AuditLog } from '@boxedout-libs/shared/interceptors/audit-log.interceptor';
import { LogActionTypeEnum } from '@boxedout-libs/shared/log-action.enum';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';

@Resolver(() => UserPhoneType)
export class UserPhoneResolver {
  constructor(private userPhoneService: UserPhoneService) {}

  @Auth([RoleEnum.AGENT])
  @UseInterceptors(new AgGridInterceptor())
  @Query(returnValue(UserPhoneGrid), {
    description:
      'Role: agent. Get the current phone number and status associated with a user.',
  })
  public async ManageUser_getUserPhoneGrid(
    @AgGridArgs({
      fieldMap: UserPhoneFieldMap,
    })
    findOptions: AgGridFindManyOptions<UserPhone>,
    @Args('userId', { type: returnValue(UUIDScalar) }) userId: string,
  ): Promise<[UserPhone[], number]> {
    if (!userId) {
      throw new MissingArgumentsError();
    }
    findOptions.where = forceFilters(
      findOptions.where,
      [{ key: 'userId', value: userId }],
      UserPhoneFieldMap,
    );
    return this.userPhoneService.getEntityListAgGrid(findOptions, true);
  }

  @Auth([RoleEnum.AGENT])
  @UseInterceptors(
    AuditLog(LogActionTypeEnum.USER_PHONE_CREATED, {
      argumentName: 'input',
      targetIdFieldName: 'userId',
    }),
  )
  @Mutation(returnValue(UserPhoneType), {
    description: 'Role: agent. create a phone number for an user.',
  })
  public async ManageUser_createUserPhone(
    @InputArgs({
      fieldMap: UserPhoneFieldMap,
    })
    input: UserPhoneCreateInput,
    @AgGridArgsNoPagination({
      fieldType: UserPhoneFieldMap,
    })
    findOptions: AgGridFindManyOptions<UserPhone>,
  ): Promise<UserPhoneType> {
    return this.userPhoneService.createEntity(input, findOptions);
  }

  @Auth([RoleEnum.AGENT])
  @UseInterceptors(
    AuditLog(LogActionTypeEnum.USER_PHONE_UPDATED, {
      argumentName: 'input',
      targetIdFieldName: 'userId',
    }),
  )
  @Mutation(returnValue(UserPhoneType), {
    description: 'Role: agent. Updates a phone number of an user.',
  })
  public async ManageUser_updateUserPhone(
    @InputArgs({
      _name: 'conditions',
      fieldMap: UserPhoneFieldMap,
    })
    conditions: UserPhoneCondition,
    @InputArgs({
      _name: 'input',
      fieldMap: UserPhoneFieldMap,
    })
    input: UserPhoneUpdateInput,
    @AgGridArgsNoPagination({
      fieldType: UserPhoneFieldMap,
    })
    findOptions: AgGridFindManyOptions<UserPhone>,
  ): Promise<UserPhoneType> {
    return this.userPhoneService.updateEntity(conditions, input, findOptions);
  }

  @Auth([RoleEnum.AGENT])
  @UseInterceptors(
    AuditLog(LogActionTypeEnum.USER_PHONE_DELETED, {
      argumentName: 'input',
      targetIdFieldName: 'userId',
    }),
  )
  @Mutation(returnValue(Boolean), {
    description: "Role: agent. delete user's phone.",
  })
  public async ManageUser_deleteUserPhone(
    @InputArgs({
      _name: 'conditions',
      fieldMap: UserPhoneFieldMap,
    })
    conditions: UserPhoneCondition,
  ): Promise<boolean> {
    return this.userPhoneService.deleteEntity(conditions);
  }
}
