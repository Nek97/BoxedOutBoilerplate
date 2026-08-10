import { UserCompensate } from '@boxedout-libs/db-boxedoutAdmin/entities/admin-metadata/compensate-custom.entity';
import { AgGridDependencyFactory } from '@nestjs-yalc/ag-grid/ag-grid.helpers';
import { resolverFactory } from '@nestjs-yalc/ag-grid/generic-resolver.resolver';
import { GQLDataLoader } from '@nestjs-yalc/data-loader/dataloader.helper';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import {
  UserCompensateConditionType,
  UserCompensateInputType,
  UserCompensateStatusInputType,
  UserCompensateType,
} from './dto/user-compensate.type';
import { ModuleRef } from '@nestjs/core';
import { DbConnection } from '@boxedout-libs/shared/db-default.conf';
import { UserCompensateService } from './user-compensate.service';
import { Auth } from '@boxedout/auth/auth.decorator';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { InputArgs } from '@nestjs-yalc/ag-grid/gqlmapper.decorator';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { AgGridArgsNoPagination } from '@nestjs-yalc/ag-grid/ag-grid-args.decorator';
import { CurrentUser } from '@boxedout/auth/gqluser.decorator';
import { IUserPayload } from '@boxedout/auth/jwt-private.strategy';
import { AgGridRepositoryFactory } from '@nestjs-yalc/ag-grid/ag-grid.repository';
import { ValidationError } from 'apollo-server-fastify';
import { AdminMetadata } from '@boxedout-libs/db-boxedoutAdmin';
import { UseInterceptors } from '@nestjs/common';
import { AuditLog } from '@boxedout-libs/shared/interceptors/audit-log.interceptor';
import { LogActionTypeEnum } from '@boxedout-libs/shared/log-action.enum';

@Resolver(returnValue(UserCompensateType))
export class UserCompensateResolver extends resolverFactory<
  UserCompensate,
  AdminMetadata
>({
  entityModel: UserCompensate,
  dto: UserCompensateType,
  prefix: 'ManageUser_',
  queries: {
    getResourceGrid: {
      decorators: [Auth([RoleEnum.SHIFT_LEAD])],
      queryParams: {
        description:
          'Role: Shift-Lead; Get the entire list of userCompensate requests',
      },
    },
    getResource: {
      disabled: true,
    },
  },
  mutations: {
    updateResource: {
      disabled: true,
    },
    createResource: {
      disabled: true,
    },
    deleteResource: {
      disabled: true,
    },
  },
  service: {
    serviceToken: 'UserCompensateService',
    dataLoaderToken: 'UserCompensateTypeDataloader',
  },
}) {
  constructor(
    protected service: UserCompensateService,
    protected dataloader: GQLDataLoader<UserCompensate>,
    protected moduleRef: ModuleRef,
  ) {
    super(service, dataloader, moduleRef);
  }

  @Auth([RoleEnum.AGENT])
  @Mutation(returnValue(UserCompensateType), {
    description: 'Role: Agent. Add a new refund request for a specific user.',
  })
  @UseInterceptors(AuditLog(LogActionTypeEnum.USER_COMPENSATE_ADD_REQUEST))
  public async ManageUser_UserCompensateAddRequest(
    @InputArgs({
      fieldType: UserCompensateType,
      _name: 'conditions',
    })
    conditions: UserCompensateConditionType,
    @Args({
      name: 'input',
    })
    input: UserCompensateInputType,
    @AgGridArgsNoPagination({
      fieldType: UserCompensateType,
    })
    findOptions: AgGridFindManyOptions<UserCompensateType>,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.service.addUserCompensateRequest(
      conditions,
      input,
      findOptions,
      user,
    );
  }

  @Auth([RoleEnum.SHIFT_LEAD])
  @Mutation(returnValue(UserCompensateType), {
    description: 'Role: Agent. Update a request for a specific user.',
  })
  @UseInterceptors(AuditLog(LogActionTypeEnum.USER_COMPENSATE_UPDATE_REQUEST))
  public async ManageUser_UserCompensateUpdateRequest(
    @InputArgs({
      _name: 'conditions',
      fieldType: UserCompensateType,
    })
    conditions: UserCompensateConditionType,
    @Args('input')
    input: UserCompensateStatusInputType,
    @AgGridArgsNoPagination({
      fieldType: UserCompensateType,
    })
    findOptions: AgGridFindManyOptions<UserCompensateType>,
    @CurrentUser() user: IUserPayload,
  ) {
    if (conditions.id === null) {
      throw new ValidationError('The id of the request cannot be null');
    }
    return this.service.addUserCompensateRequest(
      conditions,
      input,
      findOptions,
      user,
    );
  }
}

export const UserCompensateProvider = AgGridDependencyFactory<UserCompensate>({
  entityModel: UserCompensate,
  repository: AgGridRepositoryFactory(UserCompensate),
  resolver: {
    provider: UserCompensateResolver,
  },
  service: {
    dbConnection: DbConnection.BOXEDOUT_ADMIN,
    provider: {
      provide: 'UserCompensateService',
      useClass: UserCompensateService,
    },
  },
  dataloader: { databaseKey: 'dataKey', entityModel: UserCompensateType },
});
