import { BaseAppService } from '@boxedout-libs/shared/app-helpers/base-app.service';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { ManagePanelController } from '../manage-panel.controller';

describe('ManagePanelController', () => {
  let managePanelController: ManagePanelController;

  beforeEach(async () => {
    const service = createMock<BaseAppService>();
    const configService = createMock<ConfigService>();

    managePanelController = new ManagePanelController(service, configService);
  });

  it('should be defined', () => {
    expect(managePanelController).toBeInstanceOf(ManagePanelController);
  });
});
