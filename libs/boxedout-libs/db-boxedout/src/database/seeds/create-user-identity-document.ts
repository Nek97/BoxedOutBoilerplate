// @ts-nocheck
import { Factory, Seeder } from 'typeorm-seeding';
import { UserIdentityDocument } from '../../entities/user-identity-document.entity';
import {
  generateAndStoreEntities,
  getFixedUserData,
} from '@boxedout-libs/shared/seeder-helper';
import { encryptString } from '@nestjs-yalc/aws-helpers/encryption.helper';
import { reports } from '@boxedout-libs/db-boxedout/factories/user-identity-document.factory';
import * as zlib from '@nestjs-yalc/utils/zlib.helper';
import { Connection } from 'typeorm';
import { getEncMode } from '@boxedout-libs/shared/helpers/aws.helper';

export default class CreateUserId implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const fixedUserData = getFixedUserData();

    await factory(UserIdentityDocument)().create({
      xx: 12345,
      guid: fixedUserData.users[0].guid,
      data: JSON.stringify({
        onfido: await encryptString(
          zlib.deflate(JSON.stringify(reports)).toString('base64'),
          getEncMode(),
        ),
      }),
    });

    await generateAndStoreEntities(
      connection,
      fixedUserData.users,
      async (entry) => {
        return factory(UserIdentityDocument)().make({
          guid: entry.guid,
          data: JSON.stringify({
            onfido: await encryptString(
              zlib.deflate(JSON.stringify(reports)).toString('base64'),
              getEncMode(),
            ),
          }),
        });
      },
      UserIdentityDocument,
      { concurrency: 5000 },
    );
  }
}
