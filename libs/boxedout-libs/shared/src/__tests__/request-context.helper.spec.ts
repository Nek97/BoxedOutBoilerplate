import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  getArgumentsFromContext,
  getRequestFromContext,
  getRequestFromHttpContext,
  getResponseFromContext,
  getResponseFromHttpContext,
  getUserFromContext,
  getUserFromHttpContext,
} from '../helpers/request-context.helper';

jest.mock('@nestjs/graphql');

describe('Request Context Helper', () => {
  const mockedResponse = { data: 'hello' };
  const mockedRequest = {
    cookies: {
      cookie1: 'chocolate cookie',
      cookie2: 'oatmeal cookie',
    },
  };
  let mockedContext;
  beforeAll(() => {
    mockedContext = createMock<ExecutionContext>();
  });
  it('should get user from Request Context', async () => {
    const mockedUser = { userId: 'userId' };

    GqlExecutionContext.create = jest.fn().mockImplementation(() => ({
      getContext: jest.fn().mockReturnValue({ req: { user: mockedUser } }),
    }));

    const user = getUserFromContext(mockedContext);
    expect(user).toBe(mockedUser);
  });

  it('should get user from Request in a HttpContext', async () => {
    const mockedUser = { userId: 'userId' };
    const mockedHttpContext = createMock<ExecutionContext>();
    mockedHttpContext.switchToHttp = jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ user: mockedUser }),
    });

    const user = getUserFromHttpContext(mockedHttpContext);
    expect(user).toBe(mockedUser);
  });

  it('should get arguments from Request Context', async () => {
    const mockedArguments = { arg1: 'chuck', arg2: 'testa' };

    GqlExecutionContext.create = jest.fn().mockImplementation(() => ({
      getArgs: jest.fn().mockReturnValue(mockedArguments),
    }));

    const requestArguments = getArgumentsFromContext(mockedContext);
    expect(requestArguments).toBe(mockedArguments);
  });

  it('should get Request from Context', async () => {
    GqlExecutionContext.create = jest.fn().mockImplementation(() => ({
      getContext: jest.fn().mockReturnValue({ req: mockedRequest }),
    }));

    const request = getRequestFromContext(mockedContext);
    expect(request).toBe(mockedRequest);
  });

  it('should get Response from Context', async () => {
    GqlExecutionContext.create = jest.fn().mockImplementation(() => ({
      getContext: jest.fn().mockReturnValue({ response: mockedResponse }),
    }));

    const response = getResponseFromContext(mockedContext);
    expect(response).toBe(mockedResponse);
  });

  it('should get response from a HttpContext', async () => {
    const mockedHttpContext = createMock<ExecutionContext>();
    mockedHttpContext.switchToHttp = jest.fn().mockReturnValue({
      getResponse: jest.fn().mockReturnValue(mockedResponse),
    });

    const testData = getResponseFromHttpContext(mockedHttpContext);
    expect(testData).toBe(mockedResponse);
  });

  it('should get request from a HttpContext', async () => {
    const mockedHttpContext = createMock<ExecutionContext>();
    mockedHttpContext.switchToHttp = jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockedRequest),
    });

    const testData = getRequestFromHttpContext(mockedHttpContext);
    expect(testData).toBe(mockedRequest);
  });

  it('should get {} from Context', async () => {
    GqlExecutionContext.create = jest.fn().mockImplementation(() => ({
      getContext: jest.fn().mockReturnValue(null),
    }));

    const request = getRequestFromContext(mockedContext);
    expect(request).toEqual({});
  });
});
