/* istanbul ignore file */

import { InputType, ObjectType, OmitType, PartialType } from '@nestjs/graphql';
import AgGridGqlType from '@nestjs-yalc/ag-grid/ag-grid.type';
import { UserAddress } from '@boxedout-libs/db-boxedout';
import {
  AgGridField,
  AgGridObject,
} from '@nestjs-yalc/ag-grid/object.decorator';
import { IsNotEmpty } from 'class-validator';

@AgGridObject()
@ObjectType()
export class SelfUserAddressType extends UserAddress {
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
export class SelfUserAddressGrid extends AgGridGqlType<SelfUserAddressType>(
  SelfUserAddressType,
) {}

/**
 * Here all the input type for Graphql
 */
@InputType()
@AgGridObject({
  copyFrom: SelfUserAddressType,
})
export class SelfUserAddressConditionInput extends PartialType(
  SelfUserAddressType,
  InputType,
) {}

@InputType()
@AgGridObject({
  copyFrom: SelfUserAddressType,
})
export class SelfUserAddressCreateInput extends OmitType(
  SelfUserAddressConditionInput,
  ['xx', 'guid', 'verificationStatus'],
) {}

@InputType()
@AgGridObject({
  copyFrom: SelfUserAddressType,
})
export class SelfUserAddressUpdateInput extends OmitType(
  SelfUserAddressConditionInput,
  ['guid', 'xx', 'verificationStatus'],
) {}

export class SelfUserAddressDto {
  @IsNotEmpty()
  address_line_one: string;

  address_line_two?: string;

  @IsNotEmpty()
  address_zip: string;

  @IsNotEmpty()
  address_city: string;

  @IsNotEmpty()
  address_country: string;
}

export class SelfUserAddressUpdateDto {
  address_line_one?: string;
  address_line_two?: string;
  address_zip?: string;
  address_city?: string;
  address_country?: string;
}

export const restSelect: (keyof SelfUserAddressType)[] = [
  'address',
  'address2',
  'city',
  'country',
  'postalCode',
  'verificationStatus',
];
