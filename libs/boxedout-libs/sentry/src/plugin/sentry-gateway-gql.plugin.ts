// @ts-nocheck
import { Plugin } from '@nestjs/graphql';
import {
  GraphQLRequestListener,
  ApolloServerPlugin,
  GraphQLRequestContext,
} from 'apollo-server-plugin-base';
import { Transaction } from '@sentry/types';
import { SentryService } from '../sentry.service';
@Plugin()
export class GqlGatewaySentryPlugin implements ApolloServerPlugin {
  constructor(private sentryService: SentryService) {}

  async requestDidStart(
    requestContext: GraphQLRequestContext,
  ): Promise<GraphQLRequestListener> {
    if (this.sentryService.isSetted) {
      const headers = requestContext.context.req.headers;
      if (headers) {
        requestContext.context.transaction = this.sentryService.setTransaction({
          op: 'Gateway',
          name: 'Gateway_Query',
          description: requestContext.request.query,
        });
        headers['sentry-trace'] =
          requestContext.context.transaction.getTraceContext().trace_id;
      }
      return {
        willSendResponse: async ({ context }) => {
          if (context.transaction) {
            const transaction: Transaction = context.transaction;
            transaction.finish();
          }
        },
      };
    } else {
      return {};
    }
  }
}
