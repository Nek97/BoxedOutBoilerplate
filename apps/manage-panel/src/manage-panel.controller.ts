import { BaseAppController } from '@boxedout-libs/shared/app-helpers/base-app.controller';
import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ManagePanelService } from './manage-panel.service';

/**
 * Application controller
 */
@Controller()
export class ManagePanelController extends BaseAppController {
  constructor(
    protected readonly appService: ManagePanelService,
    protected readonly configService: ConfigService,
  ) {
    super(appService, configService);
  }
}
