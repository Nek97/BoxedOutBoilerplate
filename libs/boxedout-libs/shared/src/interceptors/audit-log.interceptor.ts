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
  getUserFromContext,
} from '../helpers/request-context.helper';
import {
  AuditLogEvent,
  AuditLogEventType,
  IAuditLogAdmin,
  IAuditLogData,
} from '../events/audit-log.event';
import { ClassType } from '@nestjs-yalc/types';

/**
 * Intercepts a Resolver and triggers an Audit Log event based on:
 *   - The specified Log Action type
 *   - The authenticated Admin User
 *   - The resolver's input and output data
 */
export function AuditLog(
  type: string,
  options?: {
    argumentName?: string;
    targetIdFieldName?: string;
    logBefore?: boolean;
  },
): ClassType<NestInterceptor> {
  @Injectable()
  class AuditLogInterceptor implements NestInterceptor {
    constructor(@Inject(EventEmitter2) private eventEmitter: EventEmitter2) {}

    async intercept(context: ExecutionContext, next: CallHandler) {
      const argumentsData = getArgumentsFromContext(context);
      const { userId, sessionId } = getUserFromContext(context);
      const admin: IAuditLogAdmin = { adminId: userId, sessionId };
      /**
       * if argumentName and targetIdFieldName are specified, we get the value
       * from the arguments and use it for the 'guid' field (target)
       */

      /* istanbul ignore next */
      let guid =
        options?.argumentName &&
        options.targetIdFieldName &&
        argumentsData?.[options.argumentName]?.[options.targetIdFieldName]
          ? argumentsData[options.argumentName][options.targetIdFieldName]
          : '';

      if (options?.logBefore) {
        await this.emitAuditLogEvent(
          type,
          admin,
          argumentsData,
          argumentsData,
          guid,
        );
      }

      /* istanbul ignore next */
      return next.handle().pipe(
        map(async (responseData: any) => {
          if (!options?.argumentName) {
            guid = options?.targetIdFieldName
              ? responseData[options.targetIdFieldName]
              : '';
          }
          return (
            !options?.logBefore &&
            (await this.emitAuditLogEvent(
              type,
              admin,
              argumentsData,
              responseData,
              guid,
            ))
          );
        }),
      );
    }

    /**
     * Emits the Audit Log Event and returns the received data
     * @param logActionType The Logged Action type
     * @param admin The Admin that triggered this action
     * @param data The data that is being modified
     */
    async emitAuditLogEvent(
      type: string,
      admin: IAuditLogAdmin,
      argumentsData: any,
      responseData: any,
      targetGuid: string,
    ): Promise<any> {
      const auditLogData: IAuditLogData = {
        arguments: argumentsData,
        response: responseData,
      };

      await this.eventEmitter.emitAsync(
        AuditLogEventType.CREATED,
        new AuditLogEvent(type, admin, auditLogData, targetGuid),
      );

      return responseData;
    }
  }

  return mixin(AuditLogInterceptor);
}
