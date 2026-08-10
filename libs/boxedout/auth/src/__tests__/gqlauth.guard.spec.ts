const mockedCanActivate = jest.fn();

jest.mock('@nestjs/passport', function () {
  return {
    AuthGuard: () =>
      class AuthGuard {
        canActivate() {
          return mockedCanActivate();
        }
      },
  };
});

import { GqlAuthGuard } from '../gqlauth.guard';
import * as NestGraphql from '@nestjs/graphql';

const mockedNestGraphql = NestGraphql as jest.Mocked<typeof NestGraphql>;

const validReq = 'valid_req';
const mockCreate = (mockedNestGraphql.GqlExecutionContext.create = jest.fn());
mockCreate.mockImplementation(() => ({
  getContext: jest.fn().mockReturnValue({ req: validReq }),
}));
const mockGqlExecutionContext = mockCreate();

describe('Gql Auth Guard test', () => {
  it('Check defined', async () => {
    const testData = new GqlAuthGuard();

    expect(testData).toBeDefined();
  });

  it('Check get request functionality', async () => {
    const testData = new GqlAuthGuard();
    const testGetRequest = testData.getRequest(mockGqlExecutionContext);
    expect(testData).toBeDefined();
    expect(testGetRequest).toEqual(validReq);
  });

  it('Check can activate functionality', async () => {
    mockedCanActivate.mockImplementation(() => true);
    const testData = new GqlAuthGuard();
    const testcanActivate = await testData.canActivate(mockGqlExecutionContext);
    expect(testData).toBeDefined();
    expect(testcanActivate).toBeDefined();
  });

  it('Super canActivate set to false', async () => {
    mockedCanActivate.mockImplementation(() => false);
    const testData = new GqlAuthGuard();
    const testcanActivate = await testData.canActivate(mockGqlExecutionContext);
    expect(testData).toBeDefined();
    expect(testcanActivate).toBeDefined();
  });

  it('Authservice return false', async () => {
    mockedCanActivate.mockImplementation(() => false);
    const testData = new GqlAuthGuard();
    expect(testData).toBeDefined();
    await expect(testData.canActivate({} as any)).resolves.toBeFalsy();
  });
});
