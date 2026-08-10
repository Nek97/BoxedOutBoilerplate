// @ts-nocheck
import { AgGridDependencyFactory } from '@nestjs-yalc/ag-grid/ag-grid-factory.helper';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  SkeletonBoxedOutUserCreateInput,
  SkeletonBoxedOutUserUpdateInput,
  SkeletonBoxedOutUserCondition,
  SkeletonBoxedOutUserType,
} from './dto/skeleton-user.type';
import { SkeletonBoxedOutUser } from './persistance/skeleton-user.entity';
import { Auth } from '@boxedout/auth/auth.decorator';
import {
  ExtraArgsStrategy,
  FilterType,
  GeneralFilters,
} from '@nestjs-yalc/ag-grid/ag-grid.enum';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { UseInterceptors } from '@nestjs/common';
import { AuditLog } from '@boxedout-libs/shared/interceptors/audit-log.interceptor';
import { LogActionTypeEnum } from '@boxedout-libs/shared/log-action.enum';

export const lowerCaseEmailMiddleware = (
  _ctx: GqlExecutionContext,
  input: SkeletonBoxedOutUserType,
  value: boolean,
) => {
  if (value === true) {
    input.email = input.email.toLowerCase();
  }
};

export const skeletonUserProvidersFactory = (dbConnection: string) =>
  AgGridDependencyFactory<SkeletonBoxedOutUser>({
    // The model used for TypeORM
    entityModel: SkeletonBoxedOutUser,
    resolver: {
      dto: SkeletonBoxedOutUserType,
      input: {
        create: SkeletonBoxedOutUserCreateInput,
        update: SkeletonBoxedOutUserUpdateInput,
        conditions: SkeletonBoxedOutUserCondition,
      },
      prefix: 'SkeletonBoxedOutModule_',
      queries: {
        // SkeletonUser__getSkeletonUser
        getResource: {
          decorators: [Auth([RoleEnum.SUPER_USER])],
          idName: 'guid',
          queryParams: {
            // name: 'getSkeletonUser',
            description: 'Get a specific user',
          },
        },
        getResourceGrid: {
          decorators: [Auth([RoleEnum.SUPER_USER])],
          extraArgs: {
            firstName: {
              filterCondition: GeneralFilters.CONTAINS,
              filterType: FilterType.TEXT,
              options: {
                type: returnValue(String),
                nullable: true,
              },
            },
            lastName: {
              filterCondition: GeneralFilters.CONTAINS,
              filterType: FilterType.TEXT,
              options: {
                type: returnValue(String),
                nullable: true,
              },
            },
          },
          extraArgsStrategy: ExtraArgsStrategy.AT_LEAST_ONE,
          queryParams: {
            // name: 'getSkeletonUserGrid',
            description: 'Get a list of users',
          },
        },
      },
      mutations: {
        createResource: {
          decorators: [
            Auth([RoleEnum.SUPER_USER]),
            UseInterceptors(AuditLog(LogActionTypeEnum.SKELETON_USER_CREATED)),
          ],
          extraInputs: {
            lowerCaseEmail: {
              gqlOptions: {
                description: 'Force the email to be in lowercase',
                type: returnValue(Boolean),
                defaultValue: true,
                nullable: true,
              },
              middleware: lowerCaseEmailMiddleware,
            },
          },
          queryParams: {
            // name: 'createSkeletonUser',
            description: 'Create a new user',
          },
        },
        updateResource: {
          decorators: [
            Auth([RoleEnum.SUPER_USER]),
            UseInterceptors(AuditLog(LogActionTypeEnum.SKELETON_USER_UPDATED)),
          ],
          queryParams: {
            // name: 'updateSkeletonUser',
            description: 'Update an existing user',
          },
        },
        deleteResource: {
          decorators: [
            Auth([RoleEnum.SUPER_USER]),
            UseInterceptors(AuditLog(LogActionTypeEnum.SKELETON_USER_DELETED)),
          ],
          queryParams: {
            // name: 'deleteSkeletonUser',
            description: 'Delete an existing user',
          },
        },
      },
    },

    service: {
      dbConnection: dbConnection,
    },
    dataloader: { databaseKey: 'guid' },
  });
