import { BaseVerification } from '@boxedout-libs/db-boxedoutAdmin/entities/admin-metadata/verification.entity';
import {
  applySelectOnFind,
  objectToFieldMapper,
} from '@nestjs-yalc/ag-grid/ag-grid.helpers';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { GQLDataLoader } from '@nestjs-yalc/data-loader/dataloader.helper';
import { VerificationStatus } from '../enum/verification-status.enum';
import { ValidationError } from 'apollo-server-fastify';
import { ClassType } from '@nestjs-yalc/types';
import { GenericService } from '@nestjs-yalc/ag-grid/generic-service.service';
import { DateHelper } from '@nestjs-yalc/utils/date.helper';
import { MoreThan } from 'typeorm';

export type VerificationJsonDataType = {
  data: { [key: string]: any };
};

type VerificationReturnType<T> = {
  /**
   * Boolean condition for create or update the meta entity
   */
  createOrUpdateMetaEntity: boolean;
  /**
   * The meta entity object stored in the db before update
   */
  metaEntity: T | null;
  /**
   * Object that store the information to update for the meta entity
   */
  jsonData: VerificationJsonDataType;
};

type InputRecord<T> = {
  [K in keyof T]?: T[K];
} & { verificationStatus: string };

type VerificationData<T> = {
  /**
   * The UserId of the user actually logged
   */
  actualUserId: string;

  /**
   * The foreign key used between the mainEntity and the metaEntity
   * @unique
   */
  refKey: string;

  /**
   * The input data used for the metaEntity JSON field
   */
  inputData: InputRecord<T>;
};

export const processVerification = async <T extends BaseVerification>(
  /**
   * Dataloader of the metaEntity
   */
  metaEntityDataloader: GQLDataLoader<T>,
  /**
   * Gql Type used for the mapper
   */
  metaEntityGqlType: ClassType<T>,
  /**
   * Verification input data
   */
  data: VerificationData<T>,
  /**
   * Extra field to select of the metaEntity
   * @optional
   * @defaultValue `verifier1` `verifier2` `status`
   */
  selectFieldMetaEntity: (keyof T)[] = [],
  metaFindOptions: AgGridFindManyOptions = {},
): Promise<VerificationReturnType<T>> => {
  const findOption: AgGridFindManyOptions = metaFindOptions;

  const fieldMapper = objectToFieldMapper(metaEntityGqlType);
  // This field are necessary for the verification
  [
    'verifier1',
    'verifier2',
    'status',
    'dataKey',
    ...selectFieldMetaEntity,
  ].forEach((field) => applySelectOnFind(findOption, field, fieldMapper.field));

  const metaEntity = await metaEntityDataloader.loadOne(
    data.refKey,
    findOption,
    false,
  );

  if (metaEntity?.verifier1 === data.actualUserId) {
    throw new ValidationError(
      'The second verifier should be different from the first verifier',
    );
  }

  if (
    metaEntity &&
    metaEntity.status !== VerificationStatus.AWAITING_MANUAL_APPROVAL
  ) {
    throw new ValidationError('Operation not possible');
  }
  let createOrUpdateMetaEntity: boolean;
  let updateMainEntity = null;

  const { verificationStatus, ...extraInputData } = data.inputData;
  let jsonData: VerificationJsonDataType;

  switch (verificationStatus) {
    case VerificationStatus.APPROVED:
      // If not exists the first verifier is not setted yet.
      if (!metaEntity) {
        jsonData = {
          data: {
            ...extraInputData,
            verifier1: data.actualUserId,
            status: VerificationStatus.AWAITING_MANUAL_APPROVAL,
          },
        };
        createOrUpdateMetaEntity = true;
        // If exists the second verifier must be added.
      } else {
        jsonData = {
          data: {
            verifier2: data.actualUserId,
            status: VerificationStatus.APPROVED,
          },
        };
        createOrUpdateMetaEntity = false;
        updateMainEntity = metaEntity;
      }
      break;
    case VerificationStatus.REJECTED:
      // if not exists is the first verifier
      if (!metaEntity) {
        jsonData = {
          data: {
            ...extraInputData,
            verifier1: data.actualUserId,
            status: VerificationStatus.REJECTED,
          },
        };
        createOrUpdateMetaEntity = true;
      } else {
        jsonData = {
          data: {
            verifier2: data.actualUserId,
            status: VerificationStatus.REJECTED,
          },
        };
        createOrUpdateMetaEntity = false;
        updateMainEntity = metaEntity;
      }
      break;
    default:
      throw new ValidationError(
        `The status ${verificationStatus} is not a valid status`,
      );
  }

  return {
    createOrUpdateMetaEntity,
    metaEntity: updateMainEntity,
    jsonData,
  };
};

export async function allowVerifyAction(
  service: GenericService<any>,
  field: string,
  value: string,
  secondsDelay = 0,
) {
  if (!secondsDelay) return true;

  const date = new Date();
  date.setSeconds(date.getSeconds() - secondsDelay);

  const verificationFound = await service.getRepository().findOne({
    select: ['id'],
    where: {
      filters: {
        createdAt: MoreThan(DateHelper.dateToSQLDateTime(date)),
        ['`data` -> ' + `"$.${field}"`]: ` = "${value}"`,
      },
    },
  });

  return !verificationFound;
}
