// @ts-nocheck
import { Addressbook } from '../../entities/addressbook.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { getFixedUserData } from '@boxedout-libs/shared/seeder-helper';
import { promiseMap } from '@nestjs-yalc/utils/promise.helper';
import { AddressbookStatusCompliance } from '@boxedout-libs/db-boxedout';

export default class CreateAddressbook implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const fixedUserData = getFixedUserData();

    await promiseMap(fixedUserData.users, async (entry, index) => {
      await factory(Addressbook)().create({
        guid: entry.guid,
        statusCompliance: AddressbookStatusCompliance.PENDING,
        statusSecurity: 'verified',
        uuid: `${index}`,
      });
    });

    await promiseMap(fixedUserData.users, async (entry) => {
      await factory(Addressbook)().create({
        guid: entry.guid,
      });
    });
  }
}
