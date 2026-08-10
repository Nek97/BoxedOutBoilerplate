// @ts-nocheck
import { UserMobileDevice } from '../../entities/user-mobile-device.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { getFixedUserData } from '@boxedout-libs/shared/seeder-helper';
import { promiseMap } from '@nestjs-yalc/utils/promise.helper';

export default class CreateUserMobileDevice implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const fixedUserData = getFixedUserData();
    await promiseMap(fixedUserData.users, async (entry) => {
      for (const device of entry.userMobileDevices) {
        await factory(UserMobileDevice)().create({
          guid: entry.guid,
          token: device.token,
        });
      }
    });
  }
}
