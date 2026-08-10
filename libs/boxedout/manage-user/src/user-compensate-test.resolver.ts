/* istanbul ignore file */

import { DbConnection } from '@boxedout-libs/shared/db-default.conf';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { Auth } from '@boxedout/auth/auth.decorator';
import {
  Inject,
  InternalServerErrorException,
  LoggerService,
} from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { getConnection } from 'typeorm';
import { MANAGE_USER_COMPENSATE_LOGGER_SERVICE } from './user.def';

/**
 * Used to test transaction for compensate
 */
@Resolver()
export class UserCompensateTestResolver {
  constructor(
    @Inject(MANAGE_USER_COMPENSATE_LOGGER_SERVICE)
    protected readonly compensateLogger: LoggerService,
  ) {}

  @Auth([RoleEnum.AGENT])
  @Mutation(() => Boolean)
  public async ManageUser_test_compensateTransaction() {
    const globalConnection = getConnection(DbConnection.BOXEDOUT_GLOBAL);
    const queryRunner = globalConnection.createQueryRunner('master');

    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      /* istanbul ignore next */
      this.compensateLogger.verbose?.(
        `Started transaction to update the user balance`,
      );

      await queryRunner.manager.query('SELECT * FROM boxedout.userList LIMIT 1');

      this.compensateLogger.verbose?.(`Query OK`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Verification Process Failed',
        'User balance script rollback ' + (<Error>error).message,
      );
    } finally {
      await queryRunner.release();

      /* istanbul ignore next */
      this.compensateLogger.verbose?.(`Released query`);
    }

    return true;
  }

  @Auth([RoleEnum.AGENT])
  @Mutation(() => Boolean)
  public async ManageUser_test_startTransaction(
    @Args('guid')
    guid: string,
  ) {
    const globalConnection = getConnection(DbConnection.BOXEDOUT_GLOBAL);
    await globalConnection.query(
      'SELECT * FROM boxedout.userList WHERE guid=?',
      [guid],
    );
    // const queryRunner = globalConnection.createQueryRunner();

    // await queryRunner.connect();

    // await queryRunner.manager.query(
    //   "UPDATE boxedout.userList SET firstName='Leo' WHERE guid=?",
    //   [guid],
    // );
    // await queryRunner.release();

    return true;
  }
}
