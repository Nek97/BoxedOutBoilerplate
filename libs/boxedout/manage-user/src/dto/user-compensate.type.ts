import {
  UserCompensate,
  CompensateReasonEnum,
} from '@boxedout-libs/db-boxedoutAdmin/entities/admin-metadata/compensate-custom.entity';
import { VerificationStatus } from '@boxedout-libs/shared/enum/verification-status.enum';
import {
  AgGridField,
  AgGridObject,
} from '@nestjs-yalc/ag-grid/object.decorator';
import {
  registerEnumType,
  ObjectType,
  Field,
  InputType,
  PickType,
} from '@nestjs/graphql';
import { UserType } from './user.type';

registerEnumType(CompensateReasonEnum, {
  name: 'CompensateReasonEnum',
  description: 'Enum of the compensate reason',
});

@ObjectType()
export class UserCompensateType extends UserCompensate {
  @AgGridField({
    gqlOptions: {
      name: 'requestId',
      description: 'This is the number of the request',
      nullable: true,
    },
    isRequired: true,
  })
  id: number;

  @AgGridField<UserType>({
    relation: {
      type: () => UserType,
      relationType: 'one-to-one',
      sourceKey: { dst: 'guid', alias: 'guid' },
      targetKey: { dst: 'guid', alias: 'guid' },
    },
  })
  User?: UserType;

  @AgGridField<UserType>({
    relation: {
      type: () => UserType,
      relationType: 'one-to-one',
      sourceKey: { dst: 'verifier1', alias: 'verifier1' },
      targetKey: { dst: 'guid', alias: 'guid' },
    },
  })
  Verifier1?: UserType;

  @AgGridField<UserType>({
    relation: {
      type: () => UserType,
      relationType: 'one-to-one',
      sourceKey: { dst: 'verifier2', alias: 'verifier2' },
      targetKey: { dst: 'guid', alias: 'guid' },
    },
  })
  Verifier2?: UserType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

/**
 * Update type field
 */

@InputType()
@AgGridObject({
  copyFrom: UserCompensateType,
})
export class UserCompensateInputType extends PickType(
  UserCompensateType,
  ['amount', 'reason', 'comment'] as const,
  InputType,
) {
  status: VerificationStatus;
}

@InputType()
export class UserCompensateStatusInputType {
  status: VerificationStatus;
}

/**
 * Condition type field
 */
@InputType()
@AgGridObject({
  copyFrom: UserCompensateType,
})
export class UserCompensateConditionType extends PickType(
  UserCompensateType,
  ['id'] as const,
  InputType,
) {
  userId: string;
}
