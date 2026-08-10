/* istanbul ignore file */
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  getTestFilename,
  initApp,
  runQuery,
} from '../../../../../libs/boxedout-libs/shared/src/jest/jest.helper';
import { testingEntry } from '@boxedout-libs/shared/seeder-helper';
import { ManagePanelModule } from '@boxedout-app/manage-panel/manage-panel.module';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';

const fixedGuid = testingEntry.guid;

describe(`mutation/${getTestFilename(__filename)} : userAddress test`, () => {
  let app: NestFastifyApplication;
  let loginApp: NestFastifyApplication;

  beforeAll(async () => {
    loginApp = await initApp(UserProviderModule.forRoot({ onlyAuth: true }));
    app = await initApp(ManagePanelModule.forRoot());
  });

  afterAll(async () => {
    loginApp && (await loginApp.close());
    app && (await app.close());
  });

  it('Should create data field in UserAddress', async () => {
    const input = {
      address: 'Via fedirici',
      address2: 'N 73',
      postalCode: '84014',
      city: 'Nocera Inferiore',
      country: 'IT',
      userId: fixedGuid,
    };

    const queryName = 'ManageUser_createUserAddress';

    const query = `mutation (
      $input: UserAddressCreateInput!
    ) {
      ManageUser_createUserAddress(
        input: $input) 
        {    
          address
          address2
          postalCode
          city
          verificationStatus
          country
        }
    }`;

    await runQuery({
      app,
      loginApp,
      query,
      queryName,
      role: RoleEnum.TEST,
      variables: {
        input,
      },
      callback: (body) => {
        const returnedData = body.data?.[queryName];

        expect(returnedData).toBeDefined();
        expect(returnedData?.nodes).not.toBeDefined();
        Object.keys(input).forEach((key) => {
          expect(returnedData[key]).toStrictEqual(input[key]);
        });
      },
    });
  });

  it('Should update data field in UserAddress', async () => {
    const input = {
      address: 'Via federici',
      address2: 'n 73',
      postalCode: '84014',
      city: 'Nocera Inferiore',
      country: 'IT',
    };
    const conditions = {
      address: 'Via fedirici',
      address2: 'N 73',
      postalCode: '84014',
      city: 'Nocera Inferiore',
      country: 'IT',
      userId: fixedGuid,
    };
    const queryName = 'ManageUser_updateUserAddress';

    const query = `mutation (
      $conditions: UserAddressConditionInput!
      $input: UserAddressUpdateInput!
    ) {
      ManageUser_updateUserAddress(
        input: $input,
        conditions: $conditions)
        {    
          address
          address2
          postalCode
          city
          verificationStatus
          country
        }
    }`;

    await runQuery({
      app,
      loginApp,
      query,
      queryName,
      role: RoleEnum.TEST,
      variables: {
        conditions,
        input,
      },
      callback: (body) => {
        const returnedData = body.data?.[queryName];

        expect(returnedData).toBeDefined();
        expect(returnedData?.nodes).not.toBeDefined();
        Object.keys(input).forEach((key) => {
          expect(returnedData[key]).toStrictEqual(input[key]);
        });
      },
    });
  });

  it('Should delete data field in UserAddress', async () => {
    const conditions = {
      address: 'Via federici',
      address2: 'n 73',
      postalCode: '84014',
      city: 'Nocera Inferiore',
      country: 'IT',
      userId: fixedGuid,
    };

    const queryName = 'ManageUser_deleteUserAddress';

    const query = `mutation ($conditions: UserAddressConditionInput!) {
      ManageUser_deleteUserAddress(
        conditions: $conditions)
    }`;

    await runQuery({
      app,
      loginApp,
      query,
      queryName,
      role: RoleEnum.TEST,
      variables: {
        conditions,
      },
      callback: (body) => {
        const returnedData = body.data?.[queryName];

        expect(returnedData).toEqual(true);
        expect(returnedData?.nodes).not.toBeDefined();
      },
    });
  });
});
