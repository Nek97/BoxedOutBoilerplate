import { ObjectType } from '@nestjs/graphql';
import AgGridGqlType from '@nestjs-yalc/ag-grid/ag-grid.type';
import { FieldMapper } from '@nestjs-yalc/interfaces/maps.interface';
import { UserMobileDevice } from '@boxedout-libs/db-boxedout/entities/user-mobile-device.entity';

//This map is used to translate incoming request from
//GraphQL to the actual DB field

export const UserMobileDeviceFieldMap: FieldMapper = {
  userId: { dst: 'guid' },
};

@ObjectType()
export class UserMobileDeviceType extends UserMobileDevice {}

@ObjectType()
export class UserMobileDeviceGrid extends AgGridGqlType<UserMobileDeviceType>(
  UserMobileDeviceType,
) {}
