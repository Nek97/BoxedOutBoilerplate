// @ts-nocheck
import { MigrationInterface, QueryRunner } from 'typeorm';
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

export class UserFile1640695689000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isMysqlConnectionOption(queryRunner.connection.options)) return;

    await queryRunner.query(
      ' \
        ALTER TABLE `boxedout`.`userFile` MODIFY `type` varchar(100);\
      ',
    );
  }
  public async down(): Promise<void> {
    return;
  }
}
