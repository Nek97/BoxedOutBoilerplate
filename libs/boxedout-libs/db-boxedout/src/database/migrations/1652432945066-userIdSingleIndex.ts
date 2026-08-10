// @ts-nocheck
import { MigrationInterface, QueryRunner } from 'typeorm';
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

export class UserIdSingleIndex1652432945066 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isMysqlConnectionOption(queryRunner.connection.options)) return;

    await queryRunner.query(
      'CREATE INDEX userId_documentNumberHash USING BTREE ON boxedout.userId (documentNumberHash)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE boxedout.userId DROP INDEX userId_documentNumberHash',
    );
  }
}
