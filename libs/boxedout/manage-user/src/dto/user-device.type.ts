import { ObjectType } from '@nestjs/graphql';
import AgGridGqlType from '@nestjs-yalc/ag-grid/ag-grid.type';
import { FieldMapper } from '@nestjs-yalc/interfaces/maps.interface';
import { UserDevice } from '@boxedout-libs/db-boxedout/entities/user-device.entity';

//This map is used to translate incoming request from
//GraphQL to the actual DB field
export const UserDeviceFieldMap: FieldMapper = {
  userId: { dst: 'guid' },
};

@ObjectType()
export class UserDeviceType extends UserDevice {}

@ObjectType()
export class UserDeviceGrid extends AgGridGqlType<UserDeviceType>(
  UserDeviceType,
) {}
