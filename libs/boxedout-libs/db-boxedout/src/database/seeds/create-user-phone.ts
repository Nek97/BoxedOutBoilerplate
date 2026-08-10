// @ts-nocheck
import { UserPhone } from '../../entities/user-phone.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import {
  getFixedUserData,
  seedingObject,
} from '@boxedout-libs/shared/seeder-helper';
import { promiseMap } from '@nestjs-yalc/utils/promise.helper';

export default class CreateUserPhone implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const fixedUserData = getFixedUserData();
    await promiseMap(fixedUserData.users, async (entry) => {
      for (let i = 0; i < seedingObject.relUser_UserPhone; i++) {
        const createOptions: {
          guid: string;
          phone?: string;
          active: number;
        } = {
          guid: entry.guid,
          active: i === 0 ? 1 : 0, // Only set 1 phone to active
        };
        // Only set to static value when i = 0, to prevent duplicates
        if ('phone' in entry && i === 0) {
          createOptions.phone = entry.phone;
        }
        await factory(UserPhone)().create(createOptions);
      }
    });
  }
}
