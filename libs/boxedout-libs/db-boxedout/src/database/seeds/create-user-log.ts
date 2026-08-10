// @ts-nocheck
import { UserLog } from '../../entities/user-log.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import {
  generateAndStoreEntities,
  getFixedUserData,
  seedingObject,
} from '@boxedout-libs/shared/seeder-helper';
import * as faker from 'faker';
import { Connection } from 'typeorm';

export default class CreateUserLog implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const fixedUserData = getFixedUserData();
    await generateAndStoreEntities(
      connection,
      fixedUserData.users,
      async (user) => {
        const userLogs: UserLog[] = [];
        for (let i = 0; i < seedingObject.relUser_UserLog; i++) {
          const userLog: { [key: string]: any } = {
            guid: user.guid,
            device:
              faker.datatype.number(1) === 1
                ? faker.random.arrayElement(user.userDevices).token
                : faker.random.arrayElement(user.userMobileDevices).token,
          };

          for (const ip of user.ips) {
            userLog.ip = ip;
            userLogs.push(await factory(UserLog)().make(userLog));
          }
        }

        return userLogs;
      },
      UserLog,
    );
  }
}
