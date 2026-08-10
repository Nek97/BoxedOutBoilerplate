import { BaseAppController } from '@boxedout-libs/shared/app-helpers/base-app.controller';
import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserProviderService } from './user-provider.service';

/**
 * Application controller
 */
@Controller()
export class UserProviderController extends BaseAppController {
  constructor(
    protected readonly appService: UserProviderService,
    protected readonly configService: ConfigService,
  ) {
    super(appService, configService);
  }
}
