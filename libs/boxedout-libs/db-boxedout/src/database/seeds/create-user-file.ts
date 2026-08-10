// @ts-nocheck
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { generateAndStoreEntities } from '@boxedout-libs/shared/seeder-helper';
import { UserFile } from '@boxedout-libs/db-boxedout';
import { UserIdentity } from '@boxedout-libs/db-boxedoutAdmin';
import { UserFileTypeEnum } from '@boxedout-libs/db-boxedout/entities/user-file.enum';

type UserData = Pick<UserIdentity, 'guid' | 'xx'>;

export default class CreateUserFile implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const userData: UserData[] = await connection
      .createQueryBuilder()
      .select(['xx', 'guid'])
      .from('userId', 'UserIdentity')
      .execute();

    await generateAndStoreEntities(
      connection,
      userData,
      async (user) => {
        const userFiles: UserFile[] = [];
        for (const idType of Object.values(UserFileTypeEnum)) {
          userFiles.push(
            await factory(UserFile)().make({
              guid: user.guid,
              referenceId: user.xx,
              type: idType,
            }),
          );
        }
        return userFiles;
      },
      UserFile,
    );
  }
}
