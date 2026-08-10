// @ts-nocheck
import { DBNames } from '@boxedout-libs/shared/db-default.conf';
import { AgGridField } from '@nestjs-yalc/ag-grid/object.decorator';
import { HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('userAddress', { schema: DBNames.BOXEDOUT, database: DBNames.BOXEDOUT })
export class UserAddress {
  @HideField()
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @AgGridField({
    gqlOptions: {
      name: 'userId',
      nullable: false,
    },
  })
  @Column('varchar', {
    primary: true,
    name: 'guid',
    comment: 'The guid identifier of the user',
    length: 36,
  })
  guid: string;

  @Column('varchar', {
    name: 'address',
    comment: 'The first line of the address',
    length: 60,
  })
  address: string;

  @Column('varchar', {
    name: 'address2',
    nullable: true,
    comment: 'The second line of the address',
    length: 40,
  })
  address2: string | null;

  @Column('varchar', {
    name: 'postalCode',
    comment: 'The first line of the address',
    length: 10,
  })
  postalCode: string;

  @Column('varchar', {
    name: 'city',
    comment: 'The city of the address',
    length: 30,
  })
  city: string;

  @Column('enum', {
    name: 'verificationStatus',
    enum: ['not_verified', 'verified'],
  })
  verificationStatus: string;

  @Column('varchar', {
    name: 'country',
    comment: 'The ISO 3166-2 of the country',
    length: 2,
  })
  country: string;
}
