// @ts-nocheck
import { MigrationInterface, QueryRunner } from 'typeorm';
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

export class UserIdHashIndex1652361202128 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isMysqlConnectionOption(queryRunner.connection.options)) return;

    await queryRunner.query(
      "CREATE INDEX document_hash_index USING HASH ON boxedout.userId (documentBaseDataHash,documentNumberHash) COMMENT 'Hash index for searching on duplicated values'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE boxedout.userId DROP INDEX document_hash_index',
    );
  }
}
