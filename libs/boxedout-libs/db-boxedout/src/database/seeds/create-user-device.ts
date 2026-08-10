// @ts-nocheck
import { UserDevice } from '../../entities/user-device.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { getFixedUserData } from '@boxedout-libs/shared/seeder-helper';
import { promiseMap } from '@nestjs-yalc/utils/promise.helper';

export default class CreateUserDevice implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const fixedUserData = getFixedUserData();
    await promiseMap(fixedUserData.users, async (entry) => {
      for (const device of entry.userDevices) {
        await factory(UserDevice)().create({
          guid: entry.guid,
          token: device.token,
          userAgent: device.userAgent,
        });
      }
    });
  }
}
