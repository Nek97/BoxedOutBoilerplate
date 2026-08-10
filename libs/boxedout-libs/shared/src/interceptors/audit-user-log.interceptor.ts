import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  mixin,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  getArgumentsFromContext,
  getRequestFromContext,
  getRequestFromHttpContext,
} from '../helpers/request-context.helper';
import {
  AuditUserLogEventType,
  AuditUserLogEvent,
} from '../events/audit-log.event';
import { ClassType } from '@nestjs-yalc/types';

/**
 * Intercepts a Resolver and triggers an Audit Log event based on:
 *   - The specified Log Action type
 *   - The authenticated User
 *   - The resolver's input and output data
 */
export function AuditUserLog(
  type: string,
  options?: {
    logBefore?: boolean;
    isRest?: boolean;
  },
): ClassType<NestInterceptor> {
  @Injectable()
  class AuditUserLogInterceptor implements NestInterceptor {
    constructor(@Inject(EventEmitter2) private eventEmitter: EventEmitter2) {}

    async intercept(context: ExecutionContext, next: CallHandler) {
      let argumentsData: any;
      if (!options?.isRest) {
        argumentsData = getArgumentsFromContext(context);
      }

      if (options?.logBefore) {
        await this.emitAuditUserLogEvent(
          type,
          argumentsData,
          argumentsData,
          context,
        );
      }

      /* istanbul ignore next */
      return next.handle().pipe(map(this.manageResponse(context)));
    }
    /**
     * Emits the Audit Log Event and returns the received data
     * @param type The Logged Action type
     * @param argumentsData The data to store
     * @param responseData The data to be returned
     * @param context The request context to access the user data
     */
    async emitAuditUserLogEvent(
      type: string,
      argumentsData: any,
      responseData: any,
      context: ExecutionContext,
    ): Promise<any> {
      let req;
      if (!options?.isRest) {
        req = getRequestFromContext(context);
      } else {
        req = getRequestFromHttpContext(context);
      }
      await this.eventEmitter.emitAsync(
        AuditUserLogEventType.CREATED,
        new AuditUserLogEvent(
          type,
          argumentsData,
          req.user.id,
          req.headers['user-agent'],
        ),
      );

      return responseData;
    }

    manageResponse(context: ExecutionContext) {
      return async (responseData: any) => {
        return (
          !options?.logBefore &&
          (await this.emitAuditUserLogEvent(
            type,
            responseData,
            responseData,
            context,
          ))
        );
      };
    }
  }

  return mixin(AuditUserLogInterceptor);
}
