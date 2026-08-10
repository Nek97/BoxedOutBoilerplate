/* istanbul ignore file */

import { prepareDatabase } from './helpers';

process.env.NODE_ENV = 'test';
process.env.REDIS_ENABLED = 'true';

// Used to avoid preparing the database before every test.
let donePreparing = false;

jest.setTimeout(100000);

beforeAll(async () => {
  if (!donePreparing) {
    jest.setTimeout(100000);
    await prepareDatabase();
    donePreparing = true;
  }

  jest.setTimeout(10000);

  return;
});

afterAll(() => {
  //console.log('after each');
});
