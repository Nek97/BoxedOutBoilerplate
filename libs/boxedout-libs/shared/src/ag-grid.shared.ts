// @ts-nocheck
import { FilterType, GeneralFilters } from '@nestjs-yalc/ag-grid/ag-grid.enum';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  IExtraArg,
  IIDArg,
} from '../../../common/ag-grid/src/ag-grid.interface';

export const getUserIdFromCtx = (ctx: GqlExecutionContext) => {
  return ctx.getContext().req.user.userId;
};

export const filterGetCurrentUserId: IIDArg = {
  name: 'guid',
  hidden: true,
  filterMiddleware: getUserIdFromCtx,
};

export const filterGetCurrentUserIdNamed = (name: string): IIDArg => {
  return {
    name,
    hidden: true,
    filterMiddleware: getUserIdFromCtx,
  };
};

export const extraArgGetCurrentUserId: IExtraArg = {
  filterType: FilterType.TEXT,
  filterCondition: GeneralFilters.EQUAL,
  hidden: true,
  filterMiddleware: getUserIdFromCtx,
};
