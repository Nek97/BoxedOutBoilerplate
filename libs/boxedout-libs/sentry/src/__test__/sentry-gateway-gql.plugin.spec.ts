// @ts-nocheck
import { createMock } from '@golevelup/ts-jest';
import { GqlGatewaySentryPlugin } from '../plugin';
import { SentryService } from '../sentry.service';
import { GraphQLRequestContext } from 'apollo-server-plugin-base';

jest.mock('apollo-server-plugin-base');
const requestContext: Partial<GraphQLRequestContext> = {
  context: {
    req: {
      headers: {},
    },
  },
  request: {
    query: 'query',
  },
};

describe('GqlGatewaySentryPlugin', () => {
  const mockedSentryService = createMock<SentryService>();
  let plugin: GqlGatewaySentryPlugin;

  beforeEach(() => {
    mockedSentryService.isSetted = true;
    plugin = new GqlGatewaySentryPlugin(mockedSentryService);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('Should be defined', () => {
    expect(plugin).toBeDefined();
  });

  it('Should stop sentry transaction at willSendResponse', async () => {
    const requestDidStart = await plugin.requestDidStart(
      <GraphQLRequestContext>requestContext,
    );
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

  it('Should add sentry transaction at requestDidStart', async () => {
    const spiedSetTransaction = jest
      .spyOn(mockedSentryService, 'setTransaction')
      .mockReturnValueOnce({
        finish: jest.fn(),
        getTraceContext: jest.fn().mockReturnValueOnce({
          trace_id: '1',
        }),
      } as any);

    await plugin.requestDidStart(<GraphQLRequestContext>requestContext);

    expect(spiedSetTransaction).toHaveBeenCalledTimes(1);
  });

  it('Should do anything if sentry is not setted', async () => {
    const sentryMock = createMock<SentryService>();
    sentryMock.isSetted = false;
    const pluginNoSentry = new GqlGatewaySentryPlugin(sentryMock);
    const requestDidStart = await pluginNoSentry.requestDidStart(
      <GraphQLRequestContext>requestContext,
    );
    expect(requestDidStart.willSendResponse).not.toBeDefined();
  });
});
