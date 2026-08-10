import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthEvents } from '@boxedout/auth/auth-events.enum';
import { User } from '@boxedout-libs/db-boxedout/entities/user.entity';
import { BaseAppService } from '@boxedout-libs/shared/app-helpers/base-app.service';
import { APP_LOGGER_SERVICE } from '@boxedout-libs/shared/def.const';
import { AuthMiddlewareDev } from '@boxedout/auth/auth.middleware';
import { AppEvents } from '@boxedout-libs/shared/events/app.events';
import returnValue from '@nestjs-yalc/utils/returnValue';

/**
 * Application service
 */
@Injectable()
export class UserProviderService extends BaseAppService {
  constructor(
    @Inject(APP_LOGGER_SERVICE) protected logger: LoggerService,
    private readonly authMiddlewareDev: AuthMiddlewareDev,
  ) {
    super(logger);
  }

  @OnEvent(AppEvents.BEFORE_GQL_CONTEXT_MIDDLEWARE)
  async handleBeforeGqlContextMiddleware(req: any, res: any) {
    await this.authMiddlewareDev.use(req, res, returnValue(null));
  }

  @OnEvent(AuthEvents.AFTER_USER_VALIDATION)
  handleAfterUserValidation(user: User) {
    this.logger.debug?.(`User ${user.firstName} ${user.lastName} validated`);
  }
}
