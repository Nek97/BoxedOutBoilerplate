// @ts-nocheck
import { MigrationInterface, QueryRunner, Table, TableOptions } from 'typeorm';
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

const userAppReviews: TableOptions = {
  name: 'userAppReviews',
  schema: 'boxedout',
  engine: 'InnoDB',
  columns: [
    {
      name: 'xx',
      type: 'int',
      isGenerated: true,
      isPrimary: true,
      generationStrategy: 'increment',
    },
    {
      name: 'guid',
      type: 'varchar',
      length: '36',
      collation: 'utf8mb4_unicode_ci',
      isNullable: false,
      comment: 'User ID',
    },
    {
      name: 'timestamp',
      type: 'timestamp',
      default: 'now()',
      isNullable: false,
    },
    {
      name: 'feedback',
      type: 'varchar',
      length: '20',
      collation: 'utf8mb4_unicode_ci',
      isNullable: false,
      comment: 'App review',
    },
    {
      name: 'userAgent',
      type: 'mediumtext',
      collation: 'utf8mb4_unicode_ci',
      isNullable: false,
      comment: 'To know which app version was reviewed',
    },
  ],
  indices: [
    {
      columnNames: ['guid'],
      name: 'guid',
    },
  ],
};

export class userAppReviews1646947249971 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isMysqlConnectionOption(queryRunner.connection.options)) return;

    const newTable = new Table(userAppReviews);
    await queryRunner.createTable(newTable, true);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV === 'production') return; // never drop databases in production

    await queryRunner.dropTable(userAppReviews.name, true);
  }
}
