// @ts-nocheck
import * as faker from 'faker';
import { FakerHelper } from '@nestjs-yalc/utils/faker-helper';
import { DataGeneratorHelper } from './data-generator-helper';
import { RoleEnum } from './role.enum';
const FIXED_TAG_GROUPS_ENUM = {}; const FIXED_TAGS_ENUM = {}; const fixedTags = {};
import * as fs from 'fs';
import { getSeedMaxAmount } from './get-seed-max-amount';
import { promiseMap } from '@nestjs-yalc/utils/promise.helper';
import pMap from 'p-map';
import { Connection, EntityTarget } from 'typeorm';
import { encryptAes } from '@nestjs-yalc/utils/encryption.helper';
import { staticKey } from '@nestjs-yalc/aws-helpers';
import { generateKey } from '@boxedout-libs/shared/helpers/two-factor.helper';

export const TWO_FACTOR_STATIC_KEY = generateKey();

export interface ISeedingObject {
  [key: string]: number;
  max: number;
  relUser_AdminLog: number;
  relUser_UserPhone: number; // we can only have number active, but many inactive
  relUser_UserEmail: number; // we can only have number active, but many inactive
  relUser_UserLog: number;
  relUser_Ip: number;
  relUser_UserDevice: number; // we can have many active devices per user
  relUser_UserMobileDevice: number; // we can have many active mobile devices per user
  relUser_Comment: number;
  relUser_LogAction: number;
  relUser_LogView: number;
  relUser_UserTag: number;
  relUser_Asset: number; // every asset transaction of an user
  relUser_Fiat: number; // every fiat transfer of an user
  relUser_FiuNotification: number;
  relCorporateEntity_CorporatePersonOfInterest: number; // every person of a company
}

// max is used as base amount, for every relation we will create max * rel_value entries.
// The format for naming is: rel<MainResouce>_<NestedResource>
// These are the default values for pipeline, really low for performance.
// For realistic values check /conf/dist/seedOptions_Prototype.json, when placed in /conf/seedOptions.json that one will be used over default
export const seedingObjectTest: ISeedingObject = {
  max: getSeedMaxAmount() /** TODO: remove getSeedMaxAmount() */,
  relUser_AdminLog: 1,
  relUser_UserPhone: 1,
  relUser_UserEmail: 1,
  relUser_UserLog: 1,
  relUser_Ip: 1,
  relUser_UserDevice: 1,
  relUser_UserMobileDevice: 1,
  relUser_Comment: 1,
  relUser_LogAction: 1,
  relUser_LogView: 1,
  relUser_UserTag: 1,
  relUser_Asset: 1,
  relUser_Fiat: 1,
  relUser_FiuNotification: 1,
  relCorporateEntity_CorporatePersonOfInterest: 1,
};

export const seedingObjectDev: ISeedingObject = {
  max: 50,
  relUser_AdminLog: 20,
  relUser_UserPhone: 2,
  relUser_UserEmail: 2,
  relUser_UserLog: 20,
  relUser_Ip: 1,
  relUser_UserDevice: 6,
  relUser_UserMobileDevice: 6,
  relUser_Comment: 20,
  relUser_LogAction: 20,
  relUser_LogView: 20,
  relUser_UserTag: 5,
  relUser_Asset: 50,
  relUser_Fiat: 50,
  relUser_FiuNotification: 20,
  relCorporateEntity_CorporatePersonOfInterest: 5,
};

// Keeping 1-1 relations here for reference, they do not have to be defined in the object,
// since they are immutable, they should however be created based on another entity.
// But this can be handled through the factory directly.
// const oneToOneSeeding = {
//   relUser_UserQuestionnaire: 1,
//   relUser_UserDynamic: 1,
//   relUser_UserIdentity: 1,
// };

const fakerHelper = new FakerHelper();
const dataHelper = new DataGeneratorHelper();

type FixedUserType = {
  gender: number;
  firstName: string;
  lastName: string;
  emails: string[];
  tags: string[];
  guid: string;
  userDevices: {
    token: string;
    userAgent: string;
  }[];
  userMobileDevices: {
    token: string;
    userAgent: string;
  }[];
  assetKeys: string[];
  fiatKeys: string[];
  password: string; // ATM this is static 'testtest' for all users, could have hardcoded in factory, but keeping stuff here is neater
  role?: string; // Only used for static role users
  phone?: string; // Only used for testingEntry
  ips: string[]; // Only used for testingEntry
  corporateEntity: { guid: string; corporatePersonOfInterest: number };
  boxedoutLock?: Date;
  userLock?: Date;
  accountDeleted?: number;
  twoFactor: number;
  twoFactorKey?: string;
};

// This one is used for our automated e2e tests. We need to make sure a certain entry is in db
// We use testingEntry as value for this as much as possible. (except testtest, our default pass)
export const testingEntry = {
  guid: '8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a',
  emails: ['testingEntry'],
  password: 'testtest',
  role: RoleEnum.AGENT,
  databaseKey: 'testingEntry',
  phone: '+310612345678',
  tags: ['testingEntry'],
  ips: ['127.0.0.254', '127.0.0.255'],
  gender: faker.datatype.number(1),
  firstName: 'testing',
  lastName: 'entry',
  userDevices: [
    {
      token: 'testingEntry',
      userAgent: faker.internet.userAgent(),
    },
  ],
  userMobileDevices: [
    {
      token: 'testingEntry',
      userAgent: faker.internet.userAgent(),
    },
  ],
  fiatKeys: ['testingEntry'],
  assetKeys: ['testingEntry'],
  corporateEntity: {
    corporatePersonOfInterest: 5,
    guid: '8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a',
  },
  accountDeleted: 0,
  boxedoutLock: undefined,
  userLock: undefined,
  twoFactor: 1,
  twoFactorKey: encryptAes(TWO_FACTOR_STATIC_KEY, staticKey),
};

// Use a static guid for the super_user, so frontend won't have to look in db every time.
export const SUPERUSER_GUID = 'ac77ed3e-300b-40c4-81f5-1435bfc920a5';

export const getSeedingObjectByEnv = () => {
  /**  TODO: use config service instead */
  return process.env.NODE_ENV === 'development'
    ? seedingObjectDev
    : seedingObjectTest;
};

export let seedingObject: ISeedingObject = seedingObjectDev; // use dev by default

// We try the user-defined file first, before going to default
const readSeedingOptionsFromFile = () => {
  if (fs.existsSync('conf/seedOptions.json')) {
    return JSON.parse(fs.readFileSync('conf/seedOptions.json').toString());
  } else {
    return seedingObject;
  }
};

// Important! if values are not passed, default will be used.
// Values should only be passed in the case of a lambda call,
// otherwise we use either the default, or developer defined seedOptions.json
export const setSeedingObject = (
  object: { [key: string]: number } | undefined = undefined,
) => {
  seedingObject = getSeedingObjectByEnv();

  if (typeof object === 'undefined') {
    object = readSeedingOptionsFromFile();
  }

  for (const key in object) {
    if (!(key in seedingObject)) {
      throw new Error(
        'You defined a relation in your seedingOptions.json which does not exist, check seeder-helper for format',
      );
    }
    seedingObject[key as keyof ISeedingObject] = object[key];
  }
};

export const placeDeviceAndDatabaseKey = (
  object: Partial<FixedUserType>,
): FixedUserType => {
  object.userDevices = [];
  for (let j = 0; j < seedingObject.relUser_UserDevice; j++) {
    object.userDevices.push({
      token: faker.random.alphaNumeric(40),
      userAgent: faker.internet.userAgent(),
    });
  }
  object.userMobileDevices = [];
  for (let j = 0; j < seedingObject.relUser_UserMobileDevice; j++) {
    object.userMobileDevices.push({
      token: faker.random.alphaNumeric(40),
      userAgent: faker.internet.userAgent(),
    });
  }
  object.assetKeys = [];
  for (let j = 0; j < seedingObject.relUser_Asset; j++) {
    object.assetKeys.push(dataHelper.createAssetDatabaseKey());
  }
  object.fiatKeys = [];
  for (let j = 0; j < seedingObject.relUser_Fiat; j++) {
    object.fiatKeys.push(dataHelper.createFiatDatabaseKey());
  }
  object.tags = [];

  if (seedingObject.relUser_UserTag > fixedTags.length)
    throw new Error(
      `relUser_UserTag amount (${seedingObject.relUser_UserTag}) can't be higher than fixedTags amount (${fixedTags.length}) `,
    );

  for (let i = 0; i < seedingObject.relUser_UserTag; i++) {
    let tag = faker.random.arrayElement(fixedTags).name;
    while (object.tags.includes(tag)) {
      tag = faker.random.arrayElement(fixedTags).name;
    }
    object.tags.push(tag);
  }

  object.corporateEntity = {
    guid: faker.datatype.uuid(),
    corporatePersonOfInterest:
      seedingObject.relCorporateEntity_CorporatePersonOfInterest,
  };
  return object as FixedUserType;
};

const getFixedRoles = () => {
  // Start by setting the testingEntry
  const data: FixedUserType[] = [
    {
      ...testingEntry,
    },
  ];
  for (let i = 1; i < seedingObject.relUser_UserEmail; i++) {
    // to avoid uniqueness constraint on emails
    data[0].emails.push('testingEntry_' + i);
  }
  for (let i = 1; i < seedingObject.relUser_UserTag; i++) {
    data[0].tags.push('testingEntry_' + i);
  }
  // Add a user for every role, dynamically generate devices and databaseKeys
  // const admins: string[] = [];
  const admins: { guid: string; role: string }[] = [];
  let j = 0;
  for (const role in RoleEnum) {
    const object: { [key: string]: any } = {
      gender: faker.datatype.number(1),
      firstName: role.split('_')[0].toLowerCase(),
      lastName: role.split('_').slice(1).join('_').toLowerCase(),
      // Use static guid for super_user, so frontend has easier testing.
      guid:
        RoleEnum[role as keyof typeof RoleEnum] === RoleEnum.SUPER_USER
          ? SUPERUSER_GUID
          : faker.datatype.uuid(),
      // guid: `${role.replace(/-/g, '_').toLowerCase()}`,
      emails: [`${role.replace(/-/g, '_').toLowerCase()}@test.com`],
      password: 'testtest',
      ips: [`127.0.0.${j}`],
      role: RoleEnum[role as keyof typeof RoleEnum],
      accountDeleted: faker.datatype.number(1),
      boxedoutLock: faker.datatype.boolean()
        ? faker.datatype.datetime()
        : undefined,
      userLock: faker.datatype.boolean()
        ? faker.datatype.datetime()
        : undefined,
    };
    admins.push({ guid: object.guid, role: object.role });
    j++;
    for (let i = 1; i < seedingObject.relUser_UserEmail; i++) {
      object.emails.push(
        `${role.replace(/-/g, '_').toLowerCase()}@test${i}.com`,
      );
    }
    data.push(placeDeviceAndDatabaseKey(object as Partial<FixedUserType>));
  }
  return { users: data, admins: admins };
};

const createFixedUserData = (): {
  users: FixedUserType[];
  admins: { guid: string; role: string }[];
} => {
  // Start by getting our fixed data, consisting of testingEntry as first entry and all roles after.
  const result = getFixedRoles();
  const data: FixedUserType[] = result.users;

  // Dynamically create the rest of the "fixed" data (fixed means we use the same data in different entities)
  for (let i = data.length; i < seedingObject.max; i++) {
    let object = fakerHelper.createPerson() as { [key: string]: any };
    object.password = 'testtest';
    object.emails = [object.email];
    for (let j = 1; j < seedingObject.relUser_UserEmail; j++) {
      object.emails.push(
        fakerHelper.generateNewEmail(object.firstName, object.lastName),
      );
    }
    object.ips = [faker.internet.ip()];
    object.guid = faker.datatype.uuid();
    object.accountDeleted = faker.datatype.number(1);
    object.boxedoutLock = faker.datatype.boolean()
      ? faker.datatype.datetime()
      : undefined;
    object.userLock = faker.datatype.boolean()
      ? faker.datatype.datetime()
      : undefined;
    object = placeDeviceAndDatabaseKey(object);

    data.push(object as FixedUserType);
  }
  return { users: data, admins: result.admins };
};

let fixedUserData: {
  users: FixedUserType[];
  admins: { guid: string; role: string }[];
};

// Reset should only be used by tests, not when developing.
export const getFixedUserData = (reset = false) => {
  if (!fixedUserData || reset) {
    fixedUserData = createFixedUserData();
  }
  return fixedUserData;
};

export const generateAndStoreEntities = async <Element, NewElement>(
  connection: Connection,
  input: Element[],
  mapper: (
    element: Element,
    index: number,
  ) => NewElement | Promise<NewElement | NewElement[]>,
  target: EntityTarget<NewElement>,
  options?: pMap.Options & { chunkSize?: number },
): Promise<any> => {
  let created = 0;

  const elementName = typeof target === 'function' ? target.name : target;

  const elements: NewElement[] = [];

  const databaseName = connection.options.database?.toString();

  // 250 is an optimal value for local connections: https://medium.com/@benmorel/high-speed-inserts-with-mysql-9d3dcd76f723
  const chunk = options?.chunkSize ?? 250;

  options = {
    concurrency: 10000, // default values
    ...options,
  };

  await promiseMap(
    input,
    async (...args) => {
      const result = await mapper(...args);

      if (Array.isArray(result)) {
        elements.push(...result);
        created += result.length;
      } else {
        elements.push(result);
        created++;
      }

      if (created % (input.length / chunk) === 0) {
        // eslint-disable-next-line no-console
        console.log(
          `Created ${created} elements (${elementName}) for the database ${databaseName}`,
        );
      }
    },
    options,
  );

  // eslint-disable-next-line no-console
  console.log(
    `Created ${created} elements (${elementName}) for the database ${databaseName}`,
  );

  // Because of permissions, it's better to set this directly on your DB instance
  // await connection.query('SET GLOBAL max_allowed_packet=524288000;');

  let i: number,
    round: number,
    temporary: NewElement[],
    totalAdded = 0;
  for (i = 0, round = 0; i < elements.length; i += chunk, round++) {
    temporary = elements.slice(i, i + chunk);
    await connection
      .createQueryBuilder()
      .insert()
      .into(target)
      .values(temporary)
      .execute();

    totalAdded += temporary.length;

    if (round % 10 === 0) {
      // eslint-disable-next-line no-console
      console.log(
        `Added ${totalAdded} elements (${elementName}) to the database ${databaseName}`,
      );
    }
  }

  // eslint-disable-next-line no-console
  console.log(
    `Added ${totalAdded} elements (${elementName}) to the database ${databaseName} (Done)`,
  );
};

export function randomBool(): boolean {
  return Math.random() < 0.5;
}
