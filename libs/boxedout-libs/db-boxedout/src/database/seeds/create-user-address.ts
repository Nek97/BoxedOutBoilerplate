// @ts-nocheck
import { UserAddress } from '../../entities/user-address.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { getFixedUserData } from '@boxedout-libs/shared/seeder-helper';
import { promiseMap } from '@nestjs-yalc/utils/promise.helper';

export default class CreateUserAddress implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const fixedUserData = getFixedUserData();

    await promiseMap(fixedUserData.users, async (entry) => {
      await factory(UserAddress)().create({
        guid: entry.guid,
      });
    });
  }
}
