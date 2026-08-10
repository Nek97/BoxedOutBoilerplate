// @ts-nocheck
/* istanbul ignore file */
import {
  Directive,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { FieldMapper } from '@nestjs-yalc/interfaces/maps.interface';
import { User } from '@boxedout-libs/db-boxedout/entities/user.entity';
import AgGridGqlType from '@nestjs-yalc/ag-grid/ag-grid.type';
import {
  AgGridObject,
  FilterOptionType,
  FieldAndFilterMapper,
} from '@nestjs-yalc/ag-grid/object.decorator';

/**
 * This map is used to translate incoming request from
 * GraphQL to the actual DB field
 */
export const UserFieldMap: FieldMapper = {
  ID: { dst: 'guid', isRequired: true },
  xx: { dst: 'xx', isRequired: true },
};

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "userId")')
export class UserSelfDataType {
  @Directive('@external')
  userId: string;
}

/**
 * We can use the User entity as our SSOT
 * for the User DTO
 */
@ObjectType()
@AgGridObject()
export class UserType extends User {}

@InputType()
class UserConditionType extends PartialType(UserType, InputType) {}

@ObjectType()
export class UserGrid extends AgGridGqlType<UserType>(UserType) {}

const userAgentProperties: (keyof UserType)[] = [
  'guid',
  'firstName',
  'lastName',
  'bankKey',
  'affiliateLink',
];

@ObjectType()
export class UserForAgentType extends PickType(UserType, userAgentProperties) {}

@ObjectType()
export class UserForAgentGrid extends AgGridGqlType<UserForAgentType>(
  UserForAgentType,
) {}

@InputType()
export class UserAffiliateUpdateType extends PartialType(
  PickType(UserType, ['affiliatePct']),
  InputType,
) {}

@InputType()
export class UserAffilliateConditionType extends PickType(UserConditionType, [
  'guid',
] as const) {}

export const UserForAgentFieldMap: FieldAndFilterMapper = {
  field: { ...UserFieldMap },
  filterOption: {
    type: FilterOptionType.INCLUDE,
    fields: userAgentProperties,
  },
};
