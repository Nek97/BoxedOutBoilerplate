// @ts-nocheck
import { MigrationInterface, QueryRunner } from 'typeorm';
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

export class userList1639038182337 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isMysqlConnectionOption(queryRunner.connection.options)) return;

    await queryRunner.query(
      'ALTER TABLE boxedout.userList CHANGE `twoFactorEnabledTimestamp` `twoFactorTimestamp` TIMESTAMP NULL DEFAULT NULL;',
    );
  }

  public async down() {
    return;
  }
}
