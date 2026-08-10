// @ts-nocheck
import { MigrationInterface, QueryRunner } from 'typeorm';
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

export class MultipartUploadInfo1640349437166 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isMysqlConnectionOption(queryRunner.connection.options)) return;

    await queryRunner.query(
      ' \
        CREATE TABLE IF NOT EXISTS `boxedout`.`multipartUploadInfo` ( \
        `xx` int(10) NOT NULL AUTO_INCREMENT, \
        `guid` varchar(36) NOT NULL, \
        `fileUuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL, \
        `s3UploadId` varchar(100) NOT NULL, \
        `totalParts` int(3) NOT NULL, \
        `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \
        PRIMARY KEY (`xx`), \
        KEY `guid` (`guid`), \
        KEY `fileUuid` (`fileUuid`), \
        KEY `s3UploadId` (`s3UploadId`) \
      ) ENGINE=InnoDB;',
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV === 'production') return; // never drop databases in production

    await queryRunner.dropTable('multipartUploadInfo', true);
  }
}
