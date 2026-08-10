// @ts-nocheck
import { AdminLogType, AdminLogGrid } from './dto/admin-log.type';
import { UserPhoneType, UserPhoneGrid } from './dto/user-phone.type';
import { UserLogType, UserLogGrid, UserLogExtendedGrid, UserLogExtendedType } from './dto/user-log.type';
// @ts-ignore
import { UserQuestionnaireType, UserQuestionnaireGrid } from './dto/user-questionnaire.type';
import { UserForAgentType, UserType, UserForAgentGrid, UserGrid } from './dto/user.type';
import { UserDeviceType, UserDeviceGrid } from './dto/user-device.type';
import { UserMobileDeviceType, UserMobileDeviceGrid } from './dto/user-mobile-device.type';
import { UserFileType, UserFileGrid } from './user-document.type';
import { UserEmailType } from './dto/user-email.type';
// @ts-ignore
import { LogActionTypeEnum } from '@boxedout-libs/db-boxedout/enums/log-action.enum';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  UserSelfDataType,
  UserAffiliateUpdateType,
  UserAffilliateConditionType,
  UserFieldMap,
} from './dto/user.type';
import { GqlFieldsMap } from '@nestjs-yalc/ag-grid/gqlfields.decorator';

import {
  AgGridArgs,
  AgGridArgsNoPagination,
  AgGridArgsSingleDecorator,
} from '@nestjs-yalc/ag-grid/ag-grid-args.decorator';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { Auth } from '@boxedout/auth/auth.decorator';
/**
 * domain based imports
 */
import { User } from '@boxedout-libs/db-boxedout/entities/user.entity';
import { AgGridInterceptor } from '@nestjs-yalc/ag-grid/ag-grid.interceptor';
import { AdminLogDL } from './admin-log-dataloader';
import { AdminLog } from '@boxedout-libs/db-boxedout/entities/admin-log.entity';
import { UserPhone } from '@boxedout-libs/db-boxedout/entities/user-phone.entity';
import { UserPhoneDL } from './user-phone-dataloader';
import { UserQuestionnaireDL } from './user-questionnaire-dataloader';
import { UserQuestionnaire } from '@boxedout-libs/db-boxedout/entities/user-questionnaire.entity';
import { UserLogDL } from './user-log-dataloader';
import { UserLog } from '@boxedout-libs/db-boxedout/entities/user-log.entity';
import { UserMobileDeviceDL } from './user-mobile-device-dataloader';
import { UserMobileDevice } from '@boxedout-libs/db-boxedout/entities/user-mobile-device.entity';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { UUIDScalar } from '@nestjs-yalc/graphql/scalars/uuid.scalar';
import { UserLogExtendedDL } from './user-log-extended-dataloader';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { SortDirection } from '@nestjs-yalc/ag-grid/ag-grid.enum';
import { UserDeviceDL } from './user-device-dataloader';
import { UserEmailService } from './user-email.service';
import { UserDevice } from '@boxedout-libs/db-boxedout/entities/user-device.entity';
import { UserEmail } from '@boxedout-libs/db-boxedout/entities/user-email.entity';
import { AuditLog } from '@boxedout-libs/shared/interceptors/audit-log.interceptor';
import { InputArgs } from '@nestjs-yalc/ag-grid/gqlmapper.decorator';
import { IUserPayload } from '@boxedout/auth/jwt-private.strategy';
import { CurrentUser } from '@boxedout/auth/gqluser.decorator';
import { UserAddress, UserFile } from '@boxedout-libs/db-boxedout';
import { UserAddressType } from './dto/user-address.type';
import {
  getDataloaderToken,
  GQLDataLoader,
} from '@nestjs-yalc/data-loader/dataloader.helper';
import { Inject, UseInterceptors } from '@nestjs/common';

@Resolver(returnValue(UserSelfDataType))
export class UserSelfResolver {
  @Auth([])
  @Query(returnValue(UserSelfDataType), {
    description:
      'Role: none. Retrieves information about the logged in user, so we can customize the frontend based on the roles associated with this account.',
    deprecationReason: `Please use the User_getSelfData, this one is now deprecated and will be removed in next versions`,
  })
  public ManageUser_getSelfData(@CurrentUser() user: IUserPayload) {
    return {
      __typename: 'UserSelfDataType',
      userId: user.userId,
      __userPayload: user,
    };
  }
}

@Resolver(returnValue(UserType))
export class UserResolver {
  constructor(
    private userService: UserService,
    private adminLogDL: AdminLogDL,
    private userPhoneDL: UserPhoneDL,
    private userQuestionnaireDL: UserQuestionnaireDL,
    private userLogDL: UserLogDL,
    private userLogExtendedDL: UserLogExtendedDL,
    private userDeviceDL: UserDeviceDL,
    private userMobileDeviceDL: UserMobileDeviceDL,
    private userEmailService: UserEmailService,
    @Inject(getDataloaderToken(UserAddress) as string)
    private userAddressDL: GQLDataLoader<UserAddress>,
  ) {}
  /**
   * @param findOptions ParamDecorator that maps the AgQueryParams input type to the FindManyOptions for our service
   */
  @Query(returnValue(UserGrid), {
    description: 'Role: management. Get all basic information for our users.',
  })
  @UseInterceptors(new AgGridInterceptor())
  @Auth([RoleEnum.MANAGEMENT])
  public async ManageUser_getUserGrid(
    @AgGridArgs({
      fieldType: UserType,
    })
    findOptions: AgGridFindManyOptions<User>,
  ): Promise<[User[], number]> {
    return this.userService.getEntityListAgGrid(findOptions, true);
  }

  @Query(returnValue(UserForAgentGrid), {
    description: 'Role: agent. Get all basic information for our users.',
  })
  @UseInterceptors(new AgGridInterceptor())
  @Auth([RoleEnum.AGENT])
  public async ManageUser_getUserForAgentGrid(
    @AgGridArgs({
      fieldType: UserForAgentType,
    })
    findOptions: AgGridFindManyOptions<User>,
  ): Promise<[User[], number]> {
    return this.userService.getEntityListAgGrid(findOptions, true);
  }

  @Query(returnValue(UserType), {
    description: 'Role: agent. Get all basic information for a single user.',
  })
  @Auth([RoleEnum.AGENT])
  public async ManageUser_getUser(
    @Args('ID', { type: returnValue(UUIDScalar) }) id: string,
    @GqlFieldsMap(UserType) fields: (keyof User)[],
  ): Promise<User> {
    return this.userService.getEntityOrFail({ guid: id }, fields);
  }

  @ResolveField(returnValue(AdminLogGrid))
  @UseInterceptors(new AgGridInterceptor())
  async AdminLog(
    @Parent() user: UserType,
    @AgGridArgs({
      fieldType: AdminLogType,
      defaultValue: {
        sorting: [{ colId: 'timestamp', sort: SortDirection.DESC }],
      },
    })
    findOptions: AgGridFindManyOptions<AdminLog>,
  ): Promise<AdminLogGrid> {
    const result = await this.adminLogDL.loadOneToMany(user.guid, findOptions);
    return result;
  }

  @ResolveField(returnValue(UserPhoneGrid))
  @UseInterceptors(new AgGridInterceptor())
  async UserPhone(
    @Parent() user: UserType,
    @AgGridArgs({
      fieldType: UserPhoneType,
    })
    findOptions: AgGridFindManyOptions<UserPhone>,
  ): Promise<UserPhoneGrid> {
    return this.userPhoneDL.loadOneToMany(user.guid, findOptions);
  }

  @ResolveField(returnValue(UserQuestionnaireGrid))
  @UseInterceptors(new AgGridInterceptor())
  async UserQuestionnaire(
    @Parent() user: UserType,
    @AgGridArgs({
      fieldType: UserQuestionnaireType,
    })
    findOptions: AgGridFindManyOptions<UserQuestionnaire>,
  ): Promise<UserQuestionnaireGrid> {
    return this.userQuestionnaireDL.loadOneToMany(user.guid, findOptions);
  }

  @ResolveField(returnValue(UserLogGrid))
  @UseInterceptors(new AgGridInterceptor())
  async UserLog(
    @Parent() user: UserType,
    @AgGridArgs({
      fieldType: UserLogType,
      defaultValue: {
        sorting: [{ colId: 'timestamp', sort: SortDirection.DESC }],
      },
    })
    findOptions: AgGridFindManyOptions<UserLog>,
  ): Promise<UserLogGrid> {
    return this.userLogDL.loadOneToMany(user.guid, findOptions);
  }

  @ResolveField(returnValue(UserLogExtendedGrid), {
    description: 'Includes extra information from IP and Asn tables',
  })
  @UseInterceptors(new AgGridInterceptor())
  async UserLogExtended(
    @Parent() user: UserType,
    @AgGridArgs({
      fieldType: UserLogType,
      defaultValue: {
        sorting: [{ colId: 'timestamp', sort: SortDirection.DESC }],
      },
    })
    findOptions: AgGridFindManyOptions<UserLogExtendedType>,
  ): Promise<UserLogExtendedGrid> {
    const result = await this.userLogExtendedDL.loadOneToMany(
      user.guid,
      findOptions,
    );
    return result;
  }

  @ResolveField(returnValue(UserDeviceGrid))
  @UseInterceptors(new AgGridInterceptor())
  async UserDevice(
    @Parent() user: UserType,
    @AgGridArgs({
      fieldType: UserDeviceType,
    })
    findOptions: AgGridFindManyOptions<UserDevice>,
  ): Promise<UserDeviceGrid> {
    return this.userDeviceDL.loadOneToMany(user.guid, findOptions);
  }

  @ResolveField(returnValue(UserMobileDeviceGrid))
  @UseInterceptors(new AgGridInterceptor())
  async UserMobileDevice(
    @Parent() user: UserType,
    @AgGridArgs({
      fieldType: UserMobileDeviceType,
    })
    findOptions: AgGridFindManyOptions<UserMobileDevice>,
  ): Promise<UserMobileDeviceGrid> {
    return this.userMobileDeviceDL.loadOneToMany(user.guid, findOptions);
  }

  @ResolveField(returnValue(UserEmailType), { nullable: true })
  async UserEmail(
    @Parent() user: UserType,
    @GqlFieldsMap(UserEmailType) fields: (keyof UserEmail)[],
  ): Promise<UserEmail | undefined> {
    return this.userEmailService.getEntity(
      { guid: user.guid, active: 1 },
      fields,
      undefined,
      undefined,
      { failOnNull: false },
    );
  }

  @ResolveField(returnValue(UserAddressType), { nullable: true })
  async UserAddress(
    @Parent() user: UserType,
    @AgGridArgsSingleDecorator({
      fieldType: UserAddressType,
    })
    fields: AgGridFindManyOptions<UserAddressType>,
  ): Promise<UserAddress | null> {
    return this.userAddressDL.loadOne(user.guid, fields);
  }

  @Auth([RoleEnum.AFFILIATE])
  @UseInterceptors(AuditLog(LogActionTypeEnum.USER_UPDATED))
  @Mutation(returnValue(UserType), {
    description: 'Role: affiliate. Update affiliatePct for a specific user.',
  })
  public async ManageUser_updateUserAffiliatePct(
    @InputArgs({
      _name: 'conditions',
      fieldType: UserFieldMap,
    })
    conditions: UserAffilliateConditionType,
    @InputArgs({
      fieldType: UserFieldMap,
    })
    input: UserAffiliateUpdateType,
    @AgGridArgsNoPagination({
      fieldType: UserType,
    })
    findOptions: AgGridFindManyOptions<UserType>,
  ): Promise<UserType> {
    return this.userService.updateEntity(conditions, input, findOptions);
  }
}
