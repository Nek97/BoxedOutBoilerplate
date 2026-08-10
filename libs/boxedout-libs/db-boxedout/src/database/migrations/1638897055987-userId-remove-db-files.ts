// @ts-nocheck
import { MigrationInterface, QueryRunner } from 'typeorm';
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

export class userIdRemoveDbFiles1638897055987 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isMysqlConnectionOption(queryRunner.connection.options)) return;

    await queryRunner.query(
      'ALTER TABLE boxedout.userId DROP COLUMN encryptionKey, DROP COLUMN front, DROP COLUMN back, DROP COLUMN liveness;',
    );
    await queryRunner.query('DROP TABLE IF EXISTS boxedout.userIdBackup;');
  }

  public async down() {
    return;
  }
}
