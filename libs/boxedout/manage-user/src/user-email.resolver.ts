import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserEmailService } from './user-email.service';
import {
  UserEmailFieldMap,
  UserEmailGrid,
  UserEmailType,
} from './dto/user-email.type';
import { UserEmail } from '@boxedout-libs/db-boxedout/entities/user-email.entity';
import { Auth } from '@boxedout/auth/auth.decorator';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import {
  AgGridArgs,
  AgGridArgsNoPagination,
} from '@nestjs-yalc/ag-grid/ag-grid-args.decorator';
import { Inject, UseInterceptors } from '@nestjs/common';
import { AgGridInterceptor } from '@nestjs-yalc/ag-grid/ag-grid.interceptor';
import { forceFilters } from '@nestjs-yalc/ag-grid/ag-grid.helpers';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { MissingArgumentsError } from '@nestjs-yalc/ag-grid/missing-arguments.error';
import { UUIDScalar } from '@nestjs-yalc/graphql/scalars/uuid.scalar';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { UserFieldMap, UserType } from './dto/user.type';
import { User } from '@boxedout-libs/db-boxedout/entities/user.entity';
import {
  getDataloaderToken,
  GQLDataLoader,
} from '@nestjs-yalc/data-loader/dataloader.helper';

@Resolver(() => UserEmailType)
export class UserEmailResolver {
  constructor(
    private userEmailService: UserEmailService,
    @Inject(getDataloaderToken(User)) private userDL: GQLDataLoader<User>,
  ) {}

  @Auth([RoleEnum.AGENT])
  @UseInterceptors(new AgGridInterceptor())
  @Query(returnValue(UserEmailGrid), {
    description:
      'Role: agent. Get the current email address and status associated with a user.',
  })
  public async ManageUser_getUserEmailGrid(
    @AgGridArgs({
      fieldMap: UserEmailFieldMap,
    })
    findOptions: AgGridFindManyOptions<UserEmail>,
    @Args('userId', { type: returnValue(UUIDScalar) }) userId: string,
  ): Promise<[UserEmail[], number]> {
    if (!userId) {
      throw new MissingArgumentsError();
    }
    findOptions.where = forceFilters(
      findOptions.where,
      [{ key: 'userId', value: userId }],
      UserEmailFieldMap,
    );
    return this.userEmailService.getEntityListAgGrid(findOptions, true);
  }

  @ResolveField(returnValue(UserType), { nullable: true })
  async User(
    @Parent() userEmail: UserEmail,
    @AgGridArgsNoPagination({
      fieldMap: UserFieldMap,
    })
    findOptions: AgGridFindManyOptions<UserType>,
  ): Promise<User | null> {
    /**@todo return single resource without await*/
    return this.userDL.loadOne(userEmail.guid, findOptions, false);
  }
}
