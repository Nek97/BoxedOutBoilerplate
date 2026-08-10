import { InputType, ObjectType, OmitType, PartialType } from '@nestjs/graphql';
import AgGridGqlType from '@nestjs-yalc/ag-grid/ag-grid.type';
import { FieldMapper } from '@nestjs-yalc/interfaces/maps.interface';
import { UserPhone } from '@boxedout-libs/db-boxedout/entities/user-phone.entity';

//This map is used to translate incoming request from
//GraphQL to the actual DB field

export const UserPhoneFieldMap: FieldMapper = {
  userId: { dst: 'guid' },
};

@ObjectType()
export class UserPhoneType extends UserPhone {}

@ObjectType()
export class UserPhoneGrid extends AgGridGqlType<UserPhoneType>(
  UserPhoneType,
) {}

@InputType()
export class UserPhoneCondition extends PartialType(
  OmitType(UserPhoneType, ['token'] as const),
  InputType,
) {}

@InputType()
export class UserPhoneCreateInput extends OmitType(UserPhoneCondition, [
  'timestamp',
] as const) {}

@InputType()
export class UserPhoneUpdateInput extends OmitType(UserPhoneCreateInput, [
  'guid',
] as const) {}
