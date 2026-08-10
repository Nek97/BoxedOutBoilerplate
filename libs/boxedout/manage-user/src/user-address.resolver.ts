import { UserAddress } from '@boxedout-libs/db-boxedout';
import { DbConnection } from '@boxedout-libs/shared/db-default.conf';
import { AuditLog } from '@boxedout-libs/shared/interceptors/audit-log.interceptor';
import { LogActionTypeEnum } from '@boxedout-libs/shared/log-action.enum';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { Auth } from '@boxedout/auth/auth.decorator';
import { FilterType, GeneralFilters } from '@nestjs-yalc/ag-grid/ag-grid.enum';
import { AgGridDependencyFactory } from '@nestjs-yalc/ag-grid/ag-grid.helpers';
import { UUIDScalar } from '@nestjs-yalc/graphql/scalars/uuid.scalar';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { UseInterceptors } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  UserAddressType,
  UserAddressCreateInput,
  UserAddressUpdateInput,
  UserAddressConditionInput,
} from './dto/user-address.type';

export const verificationStatusMiddleware = (
  _ctx: GqlExecutionContext,
  input: UserAddressType,
) => {
  input.verificationStatus = 'verified';
};

export const userAddressDeps = AgGridDependencyFactory<UserAddress>({
  entityModel: UserAddress,
  resolver: {
    dto: UserAddressType,
    input: {
      create: UserAddressCreateInput,
      update: UserAddressUpdateInput,
      conditions: UserAddressConditionInput,
    },
    readonly: false,
    prefix: 'ManageUser_',
    queries: {
      getResourceGrid: {
        disabled: true,
      },
      getResource: {
        idName: 'userId',
        decorators: [Auth([RoleEnum.AGENT])],
        queryParams: {
          description: "Role: Agent, get the user's address",
        },
      },
    },
    mutations: {
      createResource: {
        decorators: [
          Auth([RoleEnum.AGENT]),
          UseInterceptors(
            AuditLog(LogActionTypeEnum.USER_ADDRESS_CREATED, {
              logBefore: false,
            }),
          ),
        ],
        queryParams: {
          description: 'Role: Agent, add the address to an user',
        },
        extraArgs: {
          userId: {
            filterCondition: GeneralFilters.EQUAL,
            filterType: FilterType.TEXT,
            options: {
              name: 'userId',
              type: returnValue(UUIDScalar),
            },
          },
        },
        extraInputs: {
          guid: {
            gqlOptions: {
              type: returnValue(String),
              name: 'verificationStatus',
              nullable: true,
            },
            middleware: verificationStatusMiddleware,
          },
        },
      },
      updateResource: {
        decorators: [
          Auth([RoleEnum.AGENT]),
          UseInterceptors(
            AuditLog(LogActionTypeEnum.USER_ADDRESS_UPDATED, {
              logBefore: false,
            }),
          ),
        ],
        queryParams: {
          description: "Role: Agent, update the user's address",
        },
        extraArgs: {
          userId: {
            filterCondition: GeneralFilters.EQUAL,
            filterType: FilterType.TEXT,
            options: {
              name: 'userId',
              type: returnValue(UUIDScalar),
            },
          },
        },
      },
      deleteResource: {
        decorators: [
          Auth([RoleEnum.AGENT]),
          UseInterceptors(
            AuditLog(LogActionTypeEnum.USER_ADDRESS_DELETED, {
              logBefore: false,
            }),
          ),
        ],
        queryParams: {
          description: "Role: Agent, delete the users's address",
        },
        extraArgs: {
          userId: {
            filterCondition: GeneralFilters.EQUAL,
            filterType: FilterType.TEXT,
            options: {
              name: 'userId',
              type: returnValue(UUIDScalar),
            },
          },
        },
      },
    },
  },
  service: { dbConnection: DbConnection.BOXEDOUT },
  dataloader: { databaseKey: 'guid' },
});
