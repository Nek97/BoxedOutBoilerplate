import { ObjectType } from '@nestjs/graphql';
import AgGridGqlType from '@nestjs-yalc/ag-grid/ag-grid.type';
import { FieldMapper } from '@nestjs-yalc/interfaces/maps.interface';
import { AdminLog } from '@boxedout-libs/db-boxedout/entities/admin-log.entity';

export const AdminLogFieldMap: FieldMapper = {
  adminId: { dst: 'guid', isRequired: true },
  userId: { dst: 'target' },
};

@ObjectType()
export class AdminLogType extends AdminLog {}
@ObjectType()
export class AdminLogGrid extends AgGridGqlType<AdminLogType>(AdminLogType) {}
