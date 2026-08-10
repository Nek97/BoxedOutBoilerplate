import { ObjectType, registerEnumType } from '@nestjs/graphql';
import AgGridGqlType from '@nestjs-yalc/ag-grid/ag-grid.type';
import { FieldMapper } from '@nestjs-yalc/interfaces/maps.interface';
import { Role } from '@boxedout-libs/db-boxedoutAdmin/entities/role.entity';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';

export const RoleFieldMap: FieldMapper = {
  userId: { dst: 'guid' },
};

@ObjectType()
export class AssignedRoleType extends Role {}

@ObjectType()
export class AssignedRoleGrid extends AgGridGqlType<AssignedRoleType>(
  AssignedRoleType,
) {}

registerEnumType(RoleEnum, {
  name: 'RoleEnum',
});
