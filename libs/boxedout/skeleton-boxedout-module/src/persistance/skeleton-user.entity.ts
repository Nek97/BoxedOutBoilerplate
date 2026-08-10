import { AgGridField } from '@nestjs-yalc/ag-grid/object.decorator';
import { EntityWithTimestamps } from '@nestjs-yalc/database/timestamp.entity';
import { ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('skeleton-boxedout-user')
@ObjectType({ isAbstract: true })
export class SkeletonBoxedOutUser extends EntityWithTimestamps(BaseEntity) {
  @PrimaryColumn('varchar', { name: 'guid', length: 36 })
  guid: string;

  @Column('varchar')
  firstName: string;

  @Column('varchar')
  lastName: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar')
  password: string;

  // This configuration can't be moved in DTO
  // because it instructs TypeORM on how to select
  // the resource
  @AgGridField({
    dst: `CONCAT(firstName,' ', lastName)`,
    mode: 'derived',
    isSymbolic: true,
  })
  // virtual column, not selectable
  // handled by the @AgGridField
  @Column({
    select: false,
    insert: false,
    update: false,
    type: 'varchar',
  })
  fullName: string;
}
