import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseAppService } from '@boxedout-libs/shared/app-helpers/base-app.service';
import { APP_LOGGER_SERVICE } from '@boxedout-libs/shared/def.const';
import { AuthMiddlewareDev } from '@boxedout/auth/auth.middleware';
import { AppEvents } from '@boxedout-libs/shared/events/app.events';
import returnValue from '@nestjs-yalc/utils/returnValue';

/**
 * Application service
 */
@Injectable()
export class ManagePanelService extends BaseAppService {
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
}
