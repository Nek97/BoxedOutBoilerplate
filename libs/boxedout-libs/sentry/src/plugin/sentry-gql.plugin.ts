// @ts-nocheck
import { Plugin } from '@nestjs/graphql';
import {
  GraphQLRequestListener,
  ApolloServerPlugin,
} from 'apollo-server-plugin-base';
import { SentryService } from '../sentry.service';

@Plugin()
export class GqlSentryPlugin implements ApolloServerPlugin {
  constructor(private sentryService: SentryService) {}

  async requestDidStart(): Promise<GraphQLRequestListener> {
    if (this.sentryService.isSetted) {
      return {
        willSendResponse: async ({ context }) => {
          if (context.transaction) {
            context.transaction.finish();
          }
        },
        executionDidStart: async ({ request, context }) => {
          /* istanbul ignore next */
          const traceId =
            request.http?.headers.get('sentry-trace') ?? undefined;
          return {
            willResolveField: ({ info, args }) => {
              if (
                info.parentType.name === 'Query' ||
                info.parentType.name === 'Mutation'
              ) {
                context.transaction = this.sentryService.setTransaction({
                  op: 'Query',
                  description: info.fieldName,
                  name: info.fieldName,
                  traceId: traceId,
                  data: {
                    args,
                  },
                });
              }
              return;
            },
          };
        },
      };
    } else {
      return {};
    }
  }
}
