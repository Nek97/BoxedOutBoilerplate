/* istanbul ignore file */
// setup some environments
process.argv = []; // remove jest command arguments to avoid commanderjs in bootstrap() to fetch them
process.env.INCLUDE_ONLY = 'true'; // avoid main.ts to run the bootstrap() function
process.env.NODE_ENV = 'test';
process.env.TYPEORM_LOGGING = 'false';

beforeAll(() => {
  jest.setTimeout(100000);
});

afterAll(() => {
  //console.log('after each');
});
