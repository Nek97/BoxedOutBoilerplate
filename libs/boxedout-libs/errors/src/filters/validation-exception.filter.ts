import { AgGridError } from '@nestjs-yalc/ag-grid/ag-grid.error';
import { UUIDValidationError } from '@nestjs-yalc/graphql/scalars/uuid-validation.error';
import { Catch, LoggerService } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { InputValidationError } from '../input-validation.error';
import * as Sentry from '@sentry/node';

@Catch(UUIDValidationError, AgGridError)
export class ValidationExceptionFilter implements GqlExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(error: Error) {
    Sentry.captureException(error);
    const newError = new InputValidationError(
      error.message,
      (<AgGridError>error).systemMessage,
    );
    newError.stack = error.stack; // we need the stack trace for dev
    this.logger.error(
      (<AgGridError>error).systemMessage ?? newError.message,
      newError.stack,
    );

    return newError;
  }
}
