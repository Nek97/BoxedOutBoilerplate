// @ts-nocheck
import { MigrationInterface, QueryRunner } from 'typeorm';
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

export class userList1638794223834 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isMysqlConnectionOption(queryRunner.connection.options)) return;

    await queryRunner.query(
      'ALTER TABLE boxedout.userList ADD `twoFactorEnabledTimestamp` TIMESTAMP NULL DEFAULT NULL;',
    );
  }

  public async down() {
    return;
  }
}
