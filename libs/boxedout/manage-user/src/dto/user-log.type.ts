import { ObjectType } from '@nestjs/graphql';
import { UserLog } from '@boxedout-libs/db-boxedout/entities/user-log.entity';
import AgGridGqlType from '@nestjs-yalc/ag-grid/ag-grid.type';

//This map is used to translate incoming request from
//GraphQL to the actual DB field

@ObjectType()
export class UserLogType extends UserLog {}

@ObjectType()
export class UserLogExtendedType extends UserLog {
  asn?: number;
  country?: string;
  name?: string;
  risk?: number;
}

@ObjectType()
export class UserLogGrid extends AgGridGqlType<UserLogType>(UserLogType) {}

@ObjectType()
export class UserLogExtendedGrid extends AgGridGqlType<UserLogExtendedType>(
  UserLogExtendedType,
) {}
@ObjectType()
export class UserLogByUserIdType extends AgGridGqlType<UserLogType>(
  UserLogType,
) {}
