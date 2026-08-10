// @ts-nocheck
import { CreateUserEmail, CreateUsers } from '@boxedout-libs/db-boxedout';
import {
  ISeedingObject,
  seedingObjectTest,
  setSeedingObject,
  seedingObject,
} from '@boxedout-libs/shared/seeder-helper';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { factory } from 'typeorm-seeding';

export class devCreateUsers9000000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV !== 'development') return;

    const backup = { ...seedingObject };

    const newSeedingObject: ISeedingObject = {
      ...seedingObjectTest,
      max: 0,
    };

    setSeedingObject(newSeedingObject);

    await new CreateUsers().run(factory, queryRunner.connection);
    await new CreateUserEmail().run(factory, queryRunner.connection);

    // restore
    setSeedingObject(backup);
  }

  public async down(): Promise<void> {
    // nothing to do
  }
}
