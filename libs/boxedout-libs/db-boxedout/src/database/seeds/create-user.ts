// @ts-nocheck
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '@boxedout-libs/db-boxedout';
import * as bcrypt from 'bcryptjs';
import {
  generateAndStoreEntities,
  getFixedUserData,
} from '@boxedout-libs/shared/seeder-helper';
import { Connection } from 'typeorm';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const fixedUserData = getFixedUserData();

    await generateAndStoreEntities(
      connection,
      fixedUserData.users,
      async (entry) => {
        return factory(User)().make({
          guid: entry.guid,
          password: !entry.role
            ? 'fake'
            : bcrypt.hashSync(entry.password, bcrypt.genSaltSync(11)), // <-- bcrypt for fake users which can't be logged is an useless waste of time
          firstName: entry.firstName,
          lastName: entry.lastName,
          twoFactor: 1,
          twoFactorKey: entry.twoFactorKey,
          accountDeleted: entry.accountDeleted,
          boxedoutLock: entry.boxedoutLock,
          userLock: entry.userLock,
        });
      },
      User,
    );
  }
}
