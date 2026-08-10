import { AdminMetadata, UnclaimedDeposit } from '@boxedout-libs/db-boxedoutAdmin';
import { AdminMetadataCategories } from '@boxedout-libs/db-boxedoutAdmin/entities/admin-metadata.enum';
import { UserCompensate } from '@boxedout-libs/db-boxedoutAdmin/entities/admin-metadata/compensate-custom.entity';
import { DbConnection } from '@boxedout-libs/shared/db-default.conf';
import {
  allowVerifyAction,
  processVerification,
} from '@boxedout-libs/shared/helpers/verification.helper';
import { IUserPayload } from '@boxedout/auth/jwt-private.strategy';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { AgGridRepository } from '@nestjs-yalc/ag-grid/ag-grid.repository';
import { GenericService } from '@nestjs-yalc/ag-grid/generic-service.service';
import {
  getDataloaderToken,
  GQLDataLoader,
} from '@nestjs-yalc/data-loader/dataloader.helper';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  LoggerService,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserCompensateConditionType,
  UserCompensateInputType,
  UserCompensateStatusInputType,
  UserCompensateType,
} from './dto/user-compensate.type';
import { getConnection } from 'typeorm';
import { Decimal } from 'decimal.js';
import { VerificationStatus } from '@boxedout-libs/shared/enum/verification-status.enum';
import { GqlError } from '@nestjs-yalc/graphql/plugins/gql.error';
import { FiatEnum } from '@boxedout-libs/shared/fiat.enum';
import { MANAGE_USER_COMPENSATE_LOGGER_SERVICE } from './user.def';
import { ValidationError } from 'apollo-server-fastify';

type CompositeUserCompensateData = {
  dataKey: string;
  jsonData: { data: { [key: string]: any } };
  id: number;
};

@Injectable()
export class UserCompensateService extends GenericService<
  UserCompensate,
  AdminMetadata
> {
  constructor(
    @Inject(MANAGE_USER_COMPENSATE_LOGGER_SERVICE)
    protected readonly compensateLogger: LoggerService,
    @InjectRepository(UserCompensate, DbConnection.BOXEDOUT_ADMIN)
    protected userCompensateRepository: AgGridRepository<UserCompensate>,
    @InjectRepository(AdminMetadata, DbConnection.BOXEDOUT_ADMIN)
    protected adminMetadataRepository: AgGridRepository<AdminMetadata>,
    private moduleRef: ModuleRef,
  ) {
    super(userCompensateRepository, adminMetadataRepository);
  }

  public async addUserCompensateRequest(
    conditions: UserCompensateConditionType,
    input: UserCompensateInputType | UserCompensateStatusInputType,
    findOptions: AgGridFindManyOptions,
    user: IUserPayload,
  ): Promise<UnclaimedDeposit | null> {
    let dataKey = '';
    let requestId: number;

    /* istanbul ignore next */
    this.compensateLogger.verbose?.('Starting addUserCompensateRequest');

    const userCompensateDataloader: GQLDataLoader<UserCompensate> =
      await this.moduleRef.resolve(getDataloaderToken(UserCompensateType));

    /**
     * Step one: Validation and requestId Creation
     */
    /* istanbul ignore next */
    this.compensateLogger.verbose?.('Validation and requestId Creation');
    if (conditions.id) {
      requestId = conditions.id;
      dataKey = `${conditions.id}-${conditions.userId}`;

      await this.validateConditions({ dataKey });

      // Do not allow the same verifier to verify multiple requests within a specified range of time
      const secondsDelay = parseInt(
        process.env.BOXEDOUT_VERIFICATION_VERIFIER2_WAIT_SECONDS ?? '0',
        10,
      );
      if (!(await allowVerifyAction(this, 'verifier2', user.userId)))
        throw new ValidationError(
          `Request verification not allowed, you have to wait ${secondsDelay} seconds`,
        );
    } else {
      // do not allow multiple requests on same user within a certain amount of time
      const secondsDelay = parseInt(
        process.env.BOXEDOUT_VERIFICATION_SAME_USER_WAIT_SECONDS ?? '0',
        10,
      );
      if (
        !(await allowVerifyAction(
          this,
          'guid',
          conditions.userId,
          secondsDelay,
        ))
      )
        throw new ValidationError(
          `Request creation not allowed, you have to wait ${secondsDelay} seconds`,
        );

      // Create new request ID with count and fi
      const findResult = await this.repository.getManyAgGrid({
        select: ['id'],
        where: {
          filters: { ['`data` -> "$.guid"']: ` = "${conditions.userId}" ` },
        },
      });

      requestId = findResult.length + 1;
      dataKey = `${requestId}-${conditions.userId}`;
    }

    /**
     * Step two: Process Verification
     */
    /* istanbul ignore next */
    this.compensateLogger.verbose?.('Process Verification');
    const { status, ...extraInput } = input;
    const { createOrUpdateMetaEntity, metaEntity, jsonData } =
      await processVerification<UserCompensate>(
        userCompensateDataloader,
        UserCompensateType,
        {
          actualUserId: user.userId,
          refKey: dataKey,
          inputData: {
            verificationStatus: status,
            guid: conditions.userId,
            currency: FiatEnum.EUR,
            ...extraInput,
          },
        },
        ['guid', 'currency', 'amount', 'reason', 'id'],
      );

    /**
     * Step three: Create or Update the entity and script execution
     */
    /* istanbul ignore next */
    this.compensateLogger.verbose?.(
      `Create or Update the entity and script execution (Is create? ${createOrUpdateMetaEntity})`,
    );
    if (
      metaEntity &&
      metaEntity.verifier1 &&
      jsonData.data.verifier2 &&
      status === VerificationStatus.APPROVED
    ) {
      // If rollback throw error and the userCompensateEntity is not updated
      await this.executeScriptCompensation(metaEntity);
    }

    /* istanbul ignore next */
    this.compensateLogger.verbose?.('Executing addUserCompensateEntity');
    return this.addUserCompensateEntity(
      {
        dataKey,
        id: requestId,
        jsonData,
      },
      createOrUpdateMetaEntity,
      findOptions,
    );
  }

  private async addUserCompensateEntity(
    entityData: CompositeUserCompensateData,
    createOrUpdate: boolean,
    findManyOptions: AgGridFindManyOptions,
  ): Promise<UserCompensate> {
    if (createOrUpdate) {
      return this.createEntity(
        {
          category: AdminMetadataCategories.COMPENSATE_CUSTOMER,
          dataKey: entityData.dataKey,
          data: entityData.jsonData.data as JSON,
          id: entityData.id,
        },
        findManyOptions,
        true,
      );
    } else {
      return this.updateEntity(
        { dataKey: entityData.dataKey },
        entityData.jsonData as any,
        findManyOptions,
        true,
      );
    }
  }

  public async executeScriptCompensation({
    guid,
    amount,
    currency,
    reason,
  }: UserCompensate) {
    const globalConnection = getConnection(DbConnection.BOXEDOUT_GLOBAL);
    const queryRunner = globalConnection.createQueryRunner('master');

    await queryRunner.connect();

    /* istanbul ignore next */
    this.compensateLogger.debug?.(
      `Run executeScriptCompensation with params: ${JSON.stringify({
        guid,
        amount,
        currency,
        reason,
      })}`,
    );

    if (new Decimal(amount).lt(0)) {
      /* istanbul ignore next */
      this.compensateLogger.verbose?.(`Select available from userBalance`);

      const balanceQuery = await queryRunner.query(
        'SELECT available FROM userBalance.?? WHERE guid = ?',
        [currency, guid],
      );

      if (balanceQuery.length === 0) {
        /* istanbul ignore next */
        this.compensateLogger.debug?.(
          'UserBalance record for user ' + guid + ' was not found',
        );

        throw new GqlError(
          'Verification Process Failed',
          'UserBalance record for user ' + guid + ' was not found',
        );
      }
      if (new Decimal(balanceQuery[0].available).plus(amount).lt(0)) {
        /* istanbul ignore next */
        this.compensateLogger.debug?.(
          'User ' + guid + ' does not have enough balance',
        );

        throw new GqlError(
          'Verification Process Failed',
          'User ' + guid + ' does not have enough balance',
        );
      }
    }
    /**
     * This error checking is not strictly necessary for our useCase
     */
    // const existsQuery = await queryRunner.query(
    //   "SELECT * FROM userTransactions.?? WHERE guid = ? AND type = 'manually_assigned_boxedout' AND amount = ? AND data = ?",
    //   [currency, guid, amount, reason],
    // );
    // if (existsQuery.length > 0) {
    //   throw Error(
    //     'We already manually assigned the exact same amount (' +
    //       amount +
    //       ') to user ' +
    //       guid,
    //   );
    // }
    try {
      await queryRunner.startTransaction();

      /* istanbul ignore next */
      this.compensateLogger.verbose?.(
        `Started transaction to update the user balance`,
      );

      await queryRunner.manager.query(
        "INSERT INTO userTransactions.?? SET guid = ?, type = 'manually_assigned_boxedout', amount = ?, data = ?",
        [currency, guid, amount, reason],
      );

      /* istanbul ignore next */
      this.compensateLogger.verbose?.(
        `Added manually assigned userTransaction`,
      );

      await queryRunner.manager.query(
        'INSERT INTO userBalance.?? SET available = ?, guid = ? ON DUPLICATE KEY UPDATE available = available + CONVERT(?, DECIMAL(40,20))',
        [currency, amount, guid, amount],
      );

      /* istanbul ignore next */
      this.compensateLogger.verbose?.(`Added or updated user balance`);

      await queryRunner.manager.query(
        'UPDATE userBalance.boxedout SET available = available - CONVERT(?, DECIMAL(40,20)) WHERE symbol = ?',
        [amount, currency],
      );

      /* istanbul ignore next */
      this.compensateLogger.verbose?.(`Updated boxedout balance`);

      await queryRunner.commitTransaction();
    } catch (error) {
      /* istanbul ignore next */
      this.compensateLogger.error(
        'User balance script rollback ' + (<Error>error).message,
      );

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
  }
}
