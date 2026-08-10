// @ts-nocheck
import { MigrationInterface, QueryRunner } from 'typeorm';
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

export class UserProofOfFunds1640698532205 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isMysqlConnectionOption(queryRunner.connection.options)) return;

    await queryRunner.query(
      ' \
        ALTER TABLE `boxedout`.`userProofOfFunds` MODIFY fileUuids varchar(1000);\
      ',
    );
  }
  public async down(): Promise<void> {
    return;
  }
}
