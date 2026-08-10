// @ts-nocheck
import { MigrationInterface, QueryRunner, Table, TableOptions } from 'typeorm';
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

const userAddressMeta: TableOptions = {
  name: 'userAddress',
  schema: 'boxedout',
  columns: [
    {
      name: 'xx',
      type: 'int',
      length: '10',
      isPrimary: true,
      isGenerated: true,
      generationStrategy: 'increment',
    },
    {
      name: 'guid',
      type: 'varchar',
      length: '36',
      isPrimary: true,
      comment: 'The guid identifier of the user',
    },
    {
      name: 'address',
      type: 'varchar',
      collation: 'utf8mb4_unicode_ci',
      length: '60',
      isNullable: false,
      comment: 'The first line of the address',
    },
    {
      name: 'address2',
      type: 'varchar',
      length: '40',
      collation: 'utf8mb4_unicode_ci',
      isNullable: true,
      comment: 'The second line of the address',
    },
    {
      name: 'postalCode',
      type: 'varchar',
      length: '10',
      isNullable: false,
      comment: 'The first line of the address',
    },
    {
      name: 'city',
      type: 'varchar',
      length: '30',
      isNullable: false,
      comment: 'The city of the address',
    },
    {
      name: 'verificationStatus',
      type: 'enum',
      enum: ['not_verified', 'verified'],
      enumName: 'addressVerificationStatus',
    },
    {
      name: 'country',
      type: 'varchar(2)',
      enumName: 'alpha-2',
      // enum: ''
      comment: 'The ISO 3166-2 of the country',
    },
  ],
};
export class UserAddress1647337505358 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isMysqlConnectionOption(queryRunner.connection.options)) return;
    const newTable = new Table(userAddressMeta);

    await queryRunner.createTable(newTable);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV === 'production') return;
    queryRunner.dropTable(userAddressMeta.name);
  }
}
