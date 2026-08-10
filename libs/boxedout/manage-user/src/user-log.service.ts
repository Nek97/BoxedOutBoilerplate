import { Injectable } from '@nestjs/common';
import {
  UserLog,
  UserLogGlobal,
} from '@boxedout-libs/db-boxedout/entities/user-log.entity';
const Ip = class {};
import type { UserLogExtendedType } from './dto/user-log.type';
const Asn = class {};
import { GenericService } from '@nestjs-yalc/ag-grid/generic-service.service';
import { DbConnection } from '@boxedout-libs/shared/db-default.conf';
import {
  UserLogGlobalRepository,
  UserLogRepository,
} from '@boxedout-libs/db-boxedout/boxedout.repository';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { objectToFieldMapper } from '@nestjs-yalc/ag-grid/ag-grid-metadata.helper';
import { FieldMapper } from '@nestjs-yalc/interfaces';

export const UserLogFieldMap: FieldMapper = {
  userId: { dst: 'guid' },
  asn: { dst: 'asn', isSymbolic: true },
  country: { dst: 'country', isSymbolic: true },
  name: { dst: 'name', isSymbolic: true },
  risk: { dst: 'risk', isSymbolic: true },
};

@Injectable()
export class UserLogService extends GenericService<UserLog> {
  constructor(
    @InjectRepository(UserLog, 'boxedoutConnection')
    userLogRepository: UserLogRepository,
    @InjectRepository(UserLogGlobal, DbConnection.BOXEDOUT_GLOBAL)
    private userLogGlobalRepository: UserLogGlobalRepository,
  ) {
    super(userLogRepository);
  }

  /**
   *  Get the user log list grouped by IP and with counted results
   *
   * @param findOptions ParamDecorator that maps the AgQueryParams input type to the FindManyOptions for our service
   * @returns an UserLogExtended list and it's count, formatted for the ag-grid
   */
  async getUserLogExtendedList(
    findOptions: AgGridFindManyOptions,
    withCount?: false,
  ): Promise<UserLogExtendedType[]>;
  async getUserLogExtendedList(
    findOptions: AgGridFindManyOptions,
    withCount: true,
  ): Promise<[UserLogExtendedType[], number]>;
  async getUserLogExtendedList(
    findOptions: AgGridFindManyOptions,
    withCount = false,
  ): Promise<[UserLogExtendedType[], number] | UserLogExtendedType[]> {
    findOptions = {
      ...findOptions,
      join: {
        alias: 'UserLogGlobal',
        leftJoinAndSelect: {
          UserIp: 'UserLogGlobal.UserIp',
          Asn: 'UserIp.Asn',
        },
      },
      extra: {
        ...findOptions.extra,
        rawLimit: true, // we can enable this option because the relations are 1:1
        skipCount: true, // we should skip count for all complex and potentially slow queries
      },
    };

    const queryBuilder =
      this.userLogGlobalRepository.getFormattedAgGridQueryBuilder(findOptions, {
        parent: UserLogFieldMap,
        joined: {
          UserIp: objectToFieldMapper(Ip).field,
          Asn: objectToFieldMapper(Asn).field,
        },
      });

    const result = await (withCount
      ? queryBuilder.getManyAndCount()
      : queryBuilder.getMany());

    return this.flatUserLogGlobal(result);
  }

  /**
   * Flat the subentity of UserLogGlobal into a entity UserLogExtendedType
   * @param userLogData the UserLogGlobal entity array (with or without count)
   */
  flatUserLogGlobal(
    userLogData: [UserLogGlobal[], number] | UserLogGlobal[],
  ): [UserLogExtendedType[], number] | UserLogExtendedType[] {
    const flatResult = Array.isArray(userLogData[0])
      ? userLogData[0]
      : userLogData;

    for (const userLog of flatResult as UserLogGlobal[]) {
      const logExtended = userLog as UserLogExtendedType;

      if (userLog.UserIp) {
        logExtended.asn = userLog.UserIp.asn;
        logExtended.country = userLog.UserIp.country;
        logExtended.risk = userLog.UserIp.Asn.risk;
        logExtended.name = userLog.UserIp.Asn.name;
      }
    }

    return userLogData;
  }
}
