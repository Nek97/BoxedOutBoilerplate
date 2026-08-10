// @ts-nocheck
import { Injectable } from '@nestjs/common';
import {
  Breadcrumb,
  Options,
  Span,
  SpanContext,
  Transaction,
  TransactionContext,
} from '@sentry/types';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryService {
  public isSetted = false;

  constructor(readonly options?: Options) {
    if (!(options && options.dsn)) {
      return;
    }

    // INIT SENTRY COMUNICATION
    Sentry.init({
      ...options,
      integrations: [
        new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
      ],
      tracesSampler: (samplingContext) => {
        const filterName = ['_service', '_entities'];

        const { name } = samplingContext.transactionContext;
        if (filterName.includes(name)) {
          return 0;
        } else {
          return 1.0;
        }
      },
      defaultIntegrations: false,
    });
    this.isSetted = true;
  }

  public setTransaction(transactionContext: TransactionContext): Transaction {
    const transaction = Sentry.startTransaction(transactionContext);
    Sentry.configureScope((scope) => {
      scope.setSpan(transaction);
    });

    return transaction;
  }

  public setSpan(spanOptions: SpanContext): Span {
    const currentTransaction = Sentry.getCurrentHub()
      .getScope()
      ?.getTransaction();
    if (currentTransaction) {
      return currentTransaction.startChild(spanOptions);
    } else {
      throw Error('Sentry: no transaction to set the span');
    }
  }

  public addBreadcrumb(breadcumbOptions: Breadcrumb) {
    Sentry.getCurrentHub().addBreadcrumb(breadcumbOptions);
  }

  public captureException(error: Error, hint?: Sentry.EventHint) {
    Sentry.getCurrentHub().captureException(error, hint);
  }
}
