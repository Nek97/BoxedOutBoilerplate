// @ts-nocheck
import { MigrationInterface, QueryRunner } from 'typeorm';
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

export class UserIdHashColumn1650983689915 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isMysqlConnectionOption(queryRunner.connection.options)) return;

    await queryRunner.query(
      'ALTER TABLE boxedout.userId ADD documentNumberHash VARCHAR(64) NULL',
    );

    await queryRunner.query(
      'ALTER TABLE boxedout.userId ADD documentBaseDataHash VARCHAR(64) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE boxedout.userId DROP COLUMN documentNumberHash',
    );

    await queryRunner.query(
      'ALTER TABLE boxedout.userId DROP COLUMN documentBaseDataHash',
    );
  }
}
