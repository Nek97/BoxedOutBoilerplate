import { InputType, ObjectType, OmitType, PartialType } from '@nestjs/graphql';
import AgGridGqlType from '@nestjs-yalc/ag-grid/ag-grid.type';
import { UserAddress } from '@boxedout-libs/db-boxedout';
import {
  AgGridField,
  AgGridObject,
} from '@nestjs-yalc/ag-grid/object.decorator';

@AgGridObject()
@ObjectType()
export class UserAddressType extends UserAddress {
  @AgGridField({
    gqlOptions: {
      name: 'userId',
      nullable: false,
    },
  })
  guid: string;
}

@AgGridObject()
@ObjectType()
export class UserAddressGrid extends AgGridGqlType<UserAddressType>(
  UserAddressType,
) {}

/**
 * Here all the input type for Graphql
 */
@InputType()
@AgGridObject({
  copyFrom: UserAddressType,
})
export class UserAddressConditionInput extends PartialType(
  UserAddressType,
  InputType,
) {}

@InputType()
@AgGridObject({
  copyFrom: UserAddressType,
})
export class UserAddressCreateInput extends OmitType(
  UserAddressConditionInput,
  ['verificationStatus'],
) {}

@InputType()
@AgGridObject({
  copyFrom: UserAddressType,
})
export class UserAddressUpdateInput extends OmitType(
  UserAddressConditionInput,
  ['verificationStatus', 'guid'],
) {}
