/* istanbul ignore file */
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  getTestFilename,
  initApp,
  runQuery,
} from '../../../../../libs/boxedout-libs/shared/src/jest/jest.helper';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';
import {
  SelfUserAddressConditionInput,
  SelfUserAddressCreateInput,
  SelfUserAddressUpdateInput,
} from '@boxedout/user/dto/user-address.type';

describe(`mutation/${getTestFilename(__filename)} : userAddress test`, () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await initApp(UserProviderModule.forRoot());
  });

  afterAll(async () => {
    return app && (await app.close());
  });

  it('Should create data field in UserAddress', async () => {
    const input: SelfUserAddressCreateInput = {
      address: 'Via fedirici',
      address2: 'N 73',
      postalCode: '84014',
      city: 'Nocera Inferiore',
      country: 'IT',
    };

    const queryName = 'User_createUserAddress';

    const query = `mutation(
      $input: SelfUserAddressCreateInput!
      ) {
      User_createUserAddress(
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

    return runQuery({
      app,
      loginApp: app,
      query,
      queryName,
      variables: { input },
      role: RoleEnum.TEST,
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
    const input: SelfUserAddressUpdateInput = {
      address: 'Via federici',
      address2: 'n 73',
      postalCode: '84014',
      city: 'Nocera Inferiore',
      country: 'IT',
    };
    const conditions: SelfUserAddressConditionInput = {
      address: 'Via fedirici',
      address2: 'N 73',
      postalCode: '84014',
      city: 'Nocera Inferiore',
      country: 'IT',
    };
    const queryName = 'User_updateUserAddress';

    const query = `mutation (
      $conditions: SelfUserAddressConditionInput!
      $input: SelfUserAddressUpdateInput!
    ) {
      User_updateUserAddress(
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

    return runQuery({
      app,
      loginApp: app,
      query,
      queryName,
      role: RoleEnum.TEST,
      variables: {
        input,
        conditions,
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
    const conditions: SelfUserAddressConditionInput = {
      address: 'Via federici',
      address2: 'n 73',
      postalCode: '84014',
      city: 'Nocera Inferiore',
      country: 'IT',
    };

    const queryName = 'User_deleteUserAddress';

    const query = `mutation ($conditions: SelfUserAddressConditionInput!) {
      User_deleteUserAddress(
        conditions: $conditions)
    }`;

    return runQuery({
      app,
      loginApp: app,
      query,
      queryName,
      role: RoleEnum.TEST,
      variables: { conditions },
      callback: (body) => {
        const returnedData = body.data?.[queryName];

        expect(returnedData).toEqual(true);
        expect(returnedData?.nodes).not.toBeDefined();
      },
    });
  });
});
