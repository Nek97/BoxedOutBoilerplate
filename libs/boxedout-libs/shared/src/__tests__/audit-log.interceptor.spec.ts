import {
  AuditLogEvent,
  AuditLogEventType,
  IAuditLogAdmin,
  IAuditLogData,
} from '../events/audit-log.event';
import { AuditLog } from '../interceptors/audit-log.interceptor';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { LogActionTypeEnum } from '../log-action.enum';

jest.mock('../helpers/request-context.helper');

import * as RequestContextHelper from '../helpers/request-context.helper';

describe('AuditLog Interceptor', () => {
  let interceptor;
  let eventEmitterMock;

  beforeEach(() => {
    eventEmitterMock = createMock<EventEmitter2>();

    const interceptorClass = AuditLog(
      LogActionTypeEnum.USER_PHONE_UPDATED,
      undefined,
    );
    interceptor = new interceptorClass(eventEmitterMock);
  });

  it('should be able to intercept a request and its result', async () => {
    const mockedData = { data: 'outputted data' };
    const mockedAdminUser: IAuditLogAdmin = {
      sessionId: '1234',
      adminId: '1234',
    };
    const mockedArguments = { arg1: 'test' };

    const mockedExecutionContext = createMock<ExecutionContext>();

    const mockedCallHandler = createMock<CallHandler>();
    (
      mockedCallHandler.handle().pipe as jest.Mock<any, any>
    ).mockReturnValueOnce(mockedData);

    const getUserSpy = jest.spyOn(RequestContextHelper, 'getUserFromContext');
    getUserSpy.mockReturnValueOnce({
      userId: mockedAdminUser.sessionId,
      sessionId: mockedAdminUser.sessionId,
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

  it('should be able to intercept a request and its result and logBefore', async () => {
    const interceptorClass2 = AuditLog(LogActionTypeEnum.USER_PHONE_UPDATED, {
      logBefore: true,
    });
    const newInterceptor = new interceptorClass2(eventEmitterMock);

    const mockedData = { data: 'outputted data' };
    const mockedAdminUser: IAuditLogAdmin = {
      sessionId: '1234',
      adminId: '1234',
    };
    const mockedArguments = { arg1: 'test' };

    const mockedExecutionContext = createMock<ExecutionContext>();

    const mockedCallHandler = createMock<CallHandler>();
    (
      mockedCallHandler.handle().pipe as jest.Mock<any, any>
    ).mockReturnValueOnce(mockedData);

    const getUserSpy = jest.spyOn(RequestContextHelper, 'getUserFromContext');
    getUserSpy.mockReturnValueOnce({
      userId: mockedAdminUser.sessionId,
      sessionId: mockedAdminUser.sessionId,
    });

    const getArgsSpy = jest.spyOn(
      RequestContextHelper,
      'getArgumentsFromContext',
    );
    getArgsSpy.mockReturnValueOnce(mockedArguments);

    const resultData = await newInterceptor.intercept(
      mockedExecutionContext,
      mockedCallHandler,
    );

    expect(resultData).toBe(mockedData);
  });

  it('should be able to correctly generate an event', async () => {
    const mockedData = { data: 'outputted data' };
    const mockedAdminUser: IAuditLogAdmin = {
      sessionId: '1234',
      adminId: '1234',
    };
    const mockedArguments = { arg1: 'test' };

    const event = new AuditLogEvent(
      LogActionTypeEnum.USER_PHONE_UPDATED,
      mockedAdminUser,
      {
        arguments: mockedArguments,
        response: mockedData,
      } as IAuditLogData,
    );

    const eventEmitterEmitSpy = jest.spyOn(eventEmitterMock, 'emitAsync');

    const resultData = await interceptor.emitAuditLogEvent(
      LogActionTypeEnum.USER_PHONE_UPDATED,
      mockedAdminUser,
      mockedArguments,
      mockedData,
    );

    expect(eventEmitterEmitSpy).toHaveBeenCalledWith(
      AuditLogEventType.CREATED,
      event,
    );
    expect(resultData).toBe(mockedData);
  });
});
