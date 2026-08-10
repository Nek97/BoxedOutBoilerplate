// @ts-nocheck
import { AdminLog } from '@boxedout-libs/db-boxedout/entities/admin-log.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import {
  seedingObject,
  getFixedUserData,
  testingEntry,
} from '@boxedout-libs/shared/seeder-helper';
import * as faker from 'faker';
import { promiseMap } from '@nestjs-yalc/utils/promise.helper';

export default class CreateAdminLog implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const fixedUserData = getFixedUserData();
    await promiseMap(fixedUserData.users, async (entry) => {
      for (let i = 0; i < seedingObject.relUser_AdminLog; i++) {
        // let the log occur on one of the devices at random
        const device = (
          faker.datatype.number(1) === 1
            ? faker.random.arrayElement(entry.userDevices)
            : faker.random.arrayElement(entry.userMobileDevices)
        ).token;
        // Use testingEntry or picks at random from admins array
        await factory(AdminLog)().create({
          guid:
            entry.guid === testingEntry.guid
              ? entry.guid
              : faker.random.arrayElement(fixedUserData.admins).guid,
          device: device,
          target: entry.guid,
        });
      }
    });
  }
}
