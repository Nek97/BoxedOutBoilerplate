// @ts-nocheck
import { MigrationInterface, QueryRunner } from 'typeorm';
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

export class userEmailfailedLoginAttempts1639740324223
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isMysqlConnectionOption(queryRunner.connection.options)) return;

    await queryRunner.query(
      'ALTER TABLE boxedout.userEmail ADD failedLoginAttempts INT DEFAULT 0 NOT null;',
    );
  }

  public async down() {
    return;
  }
}
