// @ts-nocheck
import { createMock } from '@golevelup/ts-jest';
import { GqlSentryPlugin } from '../plugin';
import { SentryService } from '../sentry.service';
import {
  GraphQLRequestExecutionListener,
  GraphQLRequestListenerDidResolveField,
} from 'apollo-server-plugin-base';
import { Transaction } from '@sentry/types';

jest.mock('apollo-server-plugin-base');

const gqlFieldInfo = {
  parentType: {
    name: 'Query',
  },
  fieldName: 'ManageUser_getUserGrid',
};

const executionDidStartArgs = {
  request: {
    http: {
      headers: {
        get: jest.fn().mockReturnValue('id'),
      },
    },
  },
  context: {},
};
describe('GqlSentryPlugin', () => {
  const mockedSentryService = createMock<SentryService>();
  let plugin: GqlSentryPlugin;

  beforeEach(() => {
    mockedSentryService.isSetted = true;
    plugin = new GqlSentryPlugin(mockedSentryService);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('Should be defined', () => {
    expect(plugin).toBeDefined();
  });

  it('Should stop sentry transaction at willSendResponse', async () => {
    const requestDidStart = await plugin.requestDidStart();
    const willSendResponse = requestDidStart.willSendResponse;
    expect(willSendResponse).toBeDefined();

    const gqlContext = {
      context: {
        transaction: {
          finish: jest.fn(),
        },
      },
    };
    await willSendResponse(gqlContext as any);
    expect(gqlContext.context.transaction.finish).toHaveBeenCalledTimes(1);
  });

  it('Should add sentry transaction at willResolveField with traceId defined', async () => {
    const requestDidStart = await plugin.requestDidStart();
    const executionDidStart = requestDidStart.executionDidStart;
    expect(executionDidStart).toBeDefined();

    const listner = (await executionDidStart(
      executionDidStartArgs as any,
    )) as GraphQLRequestExecutionListener;

    mockedSentryService.setTransaction = jest
      .fn()
      .mockReturnValueOnce({} as Transaction);

    listner.willResolveField({
      info: gqlFieldInfo,
    } as any) as GraphQLRequestListenerDidResolveField;

    expect(mockedSentryService.setTransaction).toHaveBeenCalledTimes(1);
  });

  it('Should not start transaction if it is not a query', async () => {
    const requestDidStart = await plugin.requestDidStart();
    const executionDidStart = requestDidStart.executionDidStart;
    expect(executionDidStart).toBeDefined();

    const listner = (await executionDidStart(
      executionDidStartArgs as any,
    )) as GraphQLRequestExecutionListener;

    mockedSentryService.setTransaction = jest.fn();

    listner.willResolveField({
      context: {},
      info: { parentType: 'NotQuery' },
    } as any);

    expect(mockedSentryService.setTransaction).toHaveBeenCalledTimes(0);
  });

  it('Should do anything if sentry is not setted', async () => {
    const sentryMock = createMock<SentryService>();
    sentryMock.isSetted = false;
    const pluginNoSentry = new GqlSentryPlugin(sentryMock);
    const requestDidStart = await pluginNoSentry.requestDidStart();
    expect(requestDidStart.executionDidStart).not.toBeDefined();
  });

  it('Should add sentry transaction at willResolveField with traceId undefined ', async () => {
    mockedSentryService.setTransaction = jest
      .fn()
      .mockReturnValueOnce({} as Transaction);
    executionDidStartArgs.request.http.headers.get.mockReturnValueOnce(
      undefined,
    );
    const customArgs = {
      ...executionDidStartArgs,
      request: {
        http: undefined,
      },
    };
    const requestDidStart = await plugin.requestDidStart();
    const executionDidStart = requestDidStart.executionDidStart;

    let listner = (await executionDidStart(
      executionDidStartArgs as any,
    )) as GraphQLRequestExecutionListener;

    listner.willResolveField({
      info: gqlFieldInfo,
    } as any) as GraphQLRequestListenerDidResolveField;

    listner = (await executionDidStart(
      customArgs as any,
    )) as GraphQLRequestExecutionListener;

    listner.willResolveField({
      info: gqlFieldInfo,
    } as any) as GraphQLRequestListenerDidResolveField;

    expect(mockedSentryService.setTransaction).toHaveBeenCalledTimes(2);
  });
});
