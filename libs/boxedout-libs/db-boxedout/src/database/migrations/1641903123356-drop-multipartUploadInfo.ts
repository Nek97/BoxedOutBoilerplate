// @ts-nocheck
import { MigrationInterface, QueryRunner } from 'typeorm';
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

export class MultipartUploadInfo1641903123356 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isMysqlConnectionOption(queryRunner.connection.options)) return;

    await queryRunner.query(
      'DROP TABLE IF EXISTS `boxedout`.`multipartUploadInfo`;',
    );
  }
  public async down(): Promise<void> {
    return;
  }
}
