// @ts-nocheck
import { MigrationInterface, QueryRunner } from "typeorm";
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

export class UpdatePrivacyPolicy1643107693694 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      if (!isMysqlConnectionOption(queryRunner.connection.options)) return;

      await queryRunner.query(
        'UPDATE boxedout.userList SET `userList`.`settingsNewsletter` = 1 WHERE `userList`.`settingsNewsletter` = -1',
      );
    }

    public async down(): Promise<void> {
      return;
    }
}
