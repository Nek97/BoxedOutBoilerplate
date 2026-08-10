import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProviderEvents } from './user-provider-events.enum';

export const AfterAllRouteEvent = (eventEmitter: EventEmitter2) => {
  return (response: Response) => {
    eventEmitter.emit(UserProviderEvents.AFTER_ALL_ROUTES, response);
    return response;
  };
};
@Injectable()
export class UserProviderInterceptor implements NestInterceptor {
  constructor(private eventEmitter: EventEmitter2) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.eventEmitter.emit(UserProviderEvents.BEFORE_ALL_ROUTES, context);

    return next.handle().pipe(map(AfterAllRouteEvent(this.eventEmitter)));
  }
}
