// @ts-nocheck
import { UserEmail } from '../../entities/user-email.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import {
  generateAndStoreEntities,
  getFixedUserData,
  seedingObject,
} from '@boxedout-libs/shared/seeder-helper';
import { Connection } from 'typeorm';

export default class CreateUserEmail implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const fixedUserData = getFixedUserData();
    await generateAndStoreEntities(
      connection,
      fixedUserData.users,
      async (entry) => {
        const newElements: Promise<UserEmail>[] = [];
        for (let i = 0; i < seedingObject.relUser_UserEmail; i++) {
          if (i === 0) {
            newElements.push(
              factory(UserEmail)().make({
                guid: entry.guid,
                email: entry.emails[i],
                active: 1,
              }),
            );
          } else {
            newElements.push(
              factory(UserEmail)().make({
                guid: entry.guid,
                email: entry.emails[i],
                active: 0,
              }),
            );
          }
        }

        return await Promise.all(newElements);
      },
      UserEmail,
    );
  }
}
