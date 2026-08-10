// @ts-nocheck
import { UserProofOfFunds } from '../../entities/user-proof-of-funds.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { getFixedUserData } from '@boxedout-libs/shared/seeder-helper';
import { promiseMap } from '@nestjs-yalc/utils/promise.helper';

export default class CreateUserProofOfFunds implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const fixedUserData = getFixedUserData();
    await promiseMap(fixedUserData.users, async (entry) => {
      await factory(UserProofOfFunds)().create({
        guid: entry.guid,
      });
    });
  }
}
