// @ts-nocheck
import { UserAddress } from '@boxedout-libs/db-boxedout/entities/user-address.entity';
import {
  extraArgGetCurrentUserId,
  filterGetCurrentUserId,
} from '@boxedout-libs/shared/ag-grid.shared';
import { DbConnection } from '@boxedout-libs/shared/db-default.conf';
import { AuditUserLog } from '@boxedout-libs/shared/interceptors/audit-user-log.interceptor';
import { LogActionTypeEnum } from '@boxedout-libs/shared/log-action.enum';
import { Auth } from '@boxedout/auth/auth.decorator';
import { AgGridDependencyFactory } from '@nestjs-yalc/ag-grid/ag-grid-factory.helper';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { UseInterceptors } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  SelfUserAddressConditionInput,
  SelfUserAddressCreateInput,
  SelfUserAddressType,
  SelfUserAddressUpdateInput,
} from './dto/user-address.type';

export const setUserIdInAddress = (
  ctx: GqlExecutionContext,
  input: UserAddress,
) => {
  input.guid = ctx.getContext().req.user.userId;
};

export const userAddressDeps = AgGridDependencyFactory<UserAddress>({
  entityModel: UserAddress,
  resolver: {
    dto: SelfUserAddressType,
    input: {
      create: SelfUserAddressCreateInput,
      update: SelfUserAddressUpdateInput,
      conditions: SelfUserAddressConditionInput,
    },
    readonly: false,
    prefix: 'User_',
    queries: {
      getResourceGrid: {
        disabled: true,
      },
      getResource: {
        idName: filterGetCurrentUserId,
        decorators: [Auth([])],
        queryParams: {
          description: 'Get your address',
        },
      },
    },
    mutations: {
      createResource: {
        decorators: [
          Auth([]),
          UseInterceptors(
            AuditUserLog(LogActionTypeEnum.USER_ADDRESS_CREATED, {
              logBefore: false,
            }),
          ),
        ],
        queryParams: {
          description: 'Create your address',
        },
        extraInputs: {
          guid: {
            gqlOptions: {
              type: returnValue(String),
              name: 'guid',
              nullable: true,
            },
            middleware: setUserIdInAddress,
          },
        },
      },
      updateResource: {
        decorators: [
          Auth([]),
          UseInterceptors(
            AuditUserLog(LogActionTypeEnum.USER_ADDRESS_UPDATED, {
              logBefore: false,
            }),
          ),
        ],
        queryParams: {
          description: 'Update your address',
        },
        extraArgs: {
          guid: extraArgGetCurrentUserId,
        },
      },
      deleteResource: {
        decorators: [
          Auth([]),
          UseInterceptors(
            AuditUserLog(LogActionTypeEnum.USER_ADDRESS_DELETED, {
              logBefore: false,
            }),
          ),
        ],
        queryParams: {
          description: 'Delete your address',
        },
        extraArgs: {
          guid: extraArgGetCurrentUserId,
        },
      },
    },
  },
  service: { dbConnection: DbConnection.BOXEDOUT },
  dataloader: { databaseKey: 'guid' },
});
