// @ts-nocheck
import { MigrationInterface, QueryRunner } from 'typeorm';
import { isMysqlConnectionOption } from '@nestjs-yalc/database/db-ops.service';

export class userFile1636384462761 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (!isMysqlConnectionOption(queryRunner.connection.options)) return;

    await queryRunner.query(
      ' \
        CREATE TABLE IF NOT EXISTS `boxedout`.`userFile` ( \
        `xx` int(10) NOT NULL AUTO_INCREMENT, \
        `referenceId` int(10) NOT NULL, \
        `guid` varchar(36) NOT NULL, \
        `category` varchar(100) NOT NULL, \
        `type` varchar(100) NOT NULL, \
        `filePath` varchar(250) NULL, \
        `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \
        PRIMARY KEY (`xx`), \
        UNIQUE KEY `unique_file` (`referenceId`,`category`,`type`), \
        KEY `guid` (`guid`), \
        KEY `referenceId` (`referenceId`) \
      ) ENGINE=InnoDB;',
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV === 'production') return; // never drop databases in production

    await queryRunner.dropTable('userFile', true);
  }
}
