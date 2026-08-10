import {
  AuditUserLogEvent,
  AuditUserLogEventType,
  IAuditLogData,
} from '../events/audit-log.event';
import { AuditUserLog } from '../interceptors/audit-user-log.interceptor';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { LogActionTypeEnum } from '../log-action.enum';

jest.mock('../helpers/request-context.helper');

import * as RequestContextHelper from '../helpers/request-context.helper';

describe('AuditUserLog Interceptor', () => {
  const mockedExecutionContext = createMock<ExecutionContext>();
  const mockedCallHandler = createMock<CallHandler>();
  const mockedArguments = { arg1: 'test' };
  const mockedData = { data: 'outputted data' };
  const sessionId = '1234';
  const mockedRequest = {
    user: {
      id: 'userid',
    },
    headers: {
      ['user-agent']: 'agent',
    },
  };
  let interceptor;
  let restInterceptor;
  let restInterceptorBefore;
  let eventEmitterMock;

  beforeEach(() => {
    eventEmitterMock = createMock<EventEmitter2>();

    let interceptorClass = AuditUserLog(
      LogActionTypeEnum.USER_PHONE_UPDATED,
      undefined,
    );
    interceptor = new interceptorClass(eventEmitterMock);

    interceptorClass = AuditUserLog(LogActionTypeEnum.USER_PHONE_UPDATED, {
      isRest: true,
    });
    restInterceptor = new interceptorClass(eventEmitterMock);

    interceptorClass = AuditUserLog(LogActionTypeEnum.USER_PHONE_UPDATED, {
      isRest: true,
      logBefore: true,
    });
    restInterceptorBefore = new interceptorClass(eventEmitterMock);
  });

  it('should be able to intercept a request and its result', async () => {
    (
      mockedCallHandler.handle().pipe as jest.Mock<any, any>
    ).mockReturnValueOnce(mockedData);

    const getUserSpy = jest.spyOn(RequestContextHelper, 'getUserFromContext');
    getUserSpy.mockReturnValueOnce({
      userId: sessionId,
      sessionId: sessionId,
    });

    const getArgsSpy = jest.spyOn(
      RequestContextHelper,
      'getArgumentsFromContext',
    );
    getArgsSpy.mockReturnValueOnce(mockedArguments);

    const resultData = await interceptor.intercept(
      mockedExecutionContext,
      mockedCallHandler,
    );

    expect(resultData).toBe(mockedData);
  });

  it('should be able to intercept a rest request and its result', async () => {
    (
      mockedCallHandler.handle().pipe as jest.Mock<any, any>
    ).mockReturnValueOnce(mockedData);

    const resultData = await restInterceptor.intercept(
      mockedExecutionContext,
      mockedCallHandler,
    );

    expect(resultData).toBe(mockedData);
  });

  it('should be able to intercept a request request and its result, with configs', async () => {
    (
      mockedCallHandler.handle().pipe as jest.Mock<any, any>
    ).mockReturnValueOnce(mockedData);

    const getRequestSpy = jest.spyOn(
      RequestContextHelper,
      'getRequestFromHttpContext',
    );
    getRequestSpy.mockReturnValueOnce(mockedRequest);

    jest
      .spyOn(interceptor, 'emitAuditUserLogEvent')
      .mockImplementation((_a, _b, _c, _d) => null);
    const getArgsSpy = jest.spyOn(
      RequestContextHelper,
      'getArgumentsFromContext',
    );
    getArgsSpy.mockReturnValueOnce(mockedArguments);

    const resultData = await restInterceptorBefore.intercept(
      mockedExecutionContext,
      mockedCallHandler,
    );

    expect(resultData).toBe(mockedData);
  });

  it('should be able emit an event on a rest request', async () => {
    const getRequestSpy = jest.spyOn(
      RequestContextHelper,
      'getRequestFromHttpContext',
    );
    getRequestSpy.mockReturnValueOnce(mockedRequest);

    const resultData = await restInterceptor.emitAuditUserLogEvent(
      mockedExecutionContext,
      '',
      '',
      '',
    );

    expect(resultData).toEqual('');
  });

  it('should be able emit an event on a gql request', async () => {
    const getRequestSpy = jest.spyOn(
      RequestContextHelper,
      'getRequestFromContext',
    );
    getRequestSpy.mockReturnValueOnce(mockedRequest);

    const resultData = await interceptor.emitAuditUserLogEvent(
      mockedExecutionContext,
      '',
      '',
      '',
    );

    expect(resultData).toEqual('');
  });

  it('manageResponse should be able to emit an event', async () => {
    const spiedEmit = jest.spyOn(interceptor, 'emitAuditUserLogEvent');
    spiedEmit.mockImplementation(() => null);

    const resultFn = interceptor.manageResponse(mockedExecutionContext);
    await resultFn(null);
    // expect().toBe(null);

    expect(spiedEmit).toHaveBeenCalled();
  });

  it('manageResponse should not emit an event', async () => {
    const spiedEmit = jest.spyOn(
      restInterceptorBefore,
      'emitAuditUserLogEvent',
    );
    spiedEmit.mockImplementation(() => null);

    const resultFn = restInterceptorBefore.manageResponse(
      mockedExecutionContext,
    );
    await resultFn(null);
    // expect().toBe(null);

    expect(spiedEmit).not.toHaveBeenCalled();
  });
});
