// @ts-nocheck
import { UserQuestionnaire } from '../../entities/user-questionnaire.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { getFixedUserData } from '@boxedout-libs/shared/seeder-helper';
import { promiseMap } from '@nestjs-yalc/utils/promise.helper';

export default class CreateUserQuestionnaire implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const fixedUserData = getFixedUserData();
    await promiseMap(fixedUserData.users, async (entry) => {
      await factory(UserQuestionnaire)().create({
        guid: entry.guid,
      });
    });
  }
}
