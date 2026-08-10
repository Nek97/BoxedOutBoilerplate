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

import { RestAuthGuard } from '../restauth.guard';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';

const validReq = 'valid_req';
const mockedCtx = createMock<ExecutionContext>();
mockedCtx.switchToHttp = jest.fn().mockReturnValue({
  getRequest: jest.fn().mockReturnValue(validReq),
});

describe('Gql Auth Guard test', () => {
  it('Check defined', async () => {
    const testData = new RestAuthGuard();

    expect(testData).toBeDefined();
  });

  it('Check get request functionality', async () => {
    const testData = new RestAuthGuard();
    const testGetRequest = testData.getRequest(mockedCtx);
    expect(testData).toBeDefined();
    expect(testGetRequest).toEqual(validReq);
  });

  it('Check can activate functionality', async () => {
    mockedCanActivate.mockImplementation(() => true);
    const testData = new RestAuthGuard();
    const testcanActivate = await testData.canActivate(mockedCtx);
    expect(testData).toBeDefined();
    expect(testcanActivate).toBeDefined();
  });

  it('Super canActivate set to false', async () => {
    mockedCanActivate.mockImplementation(() => false);
    const testData = new RestAuthGuard();
    const testcanActivate = await testData.canActivate(mockedCtx);
    expect(testData).toBeDefined();
    expect(testcanActivate).toBeDefined();
  });

  it('Authservice return false', async () => {
    mockedCanActivate.mockImplementation(() => false);
    const testData = new RestAuthGuard();
    expect(testData).toBeDefined();
    await expect(testData.canActivate({} as any)).resolves.toBeFalsy();
  });
});
