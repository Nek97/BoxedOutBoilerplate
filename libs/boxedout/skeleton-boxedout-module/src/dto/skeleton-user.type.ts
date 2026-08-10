import {
  HideField,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import {
  AgGridField,
  AgGridObject,
} from '@nestjs-yalc/ag-grid/object.decorator';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { UUIDScalar } from '@nestjs-yalc/graphql/scalars/uuid.scalar';
import { SkeletonBoxedOutUser } from '../persistance/skeleton-user.entity';

@ObjectType()
@AgGridObject()
export class SkeletonBoxedOutUserType extends SkeletonBoxedOutUser {
  @HideField()
  password: string;

  // guid should be always required in SQL queries to make sure that the relation
  // is always resolved, and it should be exposed as a UUID Scalar to GraphQL
  @AgGridField({
    gqlType: returnValue(UUIDScalar),
    gqlOptions: {
      name: 'ID',
      description: 'The user ID generated with UUID',
    },
    isRequired: true,
  })
  guid: string;

  @AgGridField({
    gqlOptions: {
      description: "It's the combination of firstName and lastName",
    },
    denyFilter: true,
  })
  fullName: string;
}

/**
 * Here all the input type for Graphql
 */
@InputType()
@AgGridObject()
export class SkeletonBoxedOutUserCreateInput extends OmitType(
  SkeletonBoxedOutUserType,
  ['fullName', 'createdAt', 'updatedAt'] as const,
  InputType,
) {}

@InputType()
@AgGridObject({ copyFrom: SkeletonBoxedOutUserType })
export class SkeletonBoxedOutUserCondition extends PartialType(
  SkeletonBoxedOutUserCreateInput,
  InputType,
) {}

@InputType()
@AgGridObject({ copyFrom: SkeletonBoxedOutUserType })
export class SkeletonBoxedOutUserUpdateInput extends OmitType(
  SkeletonBoxedOutUserType,
  ['guid', 'fullName', 'createdAt', 'updatedAt'] as const,
  InputType,
) {}
