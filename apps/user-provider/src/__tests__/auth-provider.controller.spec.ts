import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { UserProviderController } from '../user-provider.controller';
import { UserProviderService } from '../user-provider.service';

describe('Test UserProviderController', () => {
  let controller: UserProviderController;

  beforeEach(async () => {
    const service = createMock<UserProviderService>();
    const configService = createMock<ConfigService>();

    controller = new UserProviderController(service, configService);
  });

  it('should be defined', () => {
    expect(controller).toBeInstanceOf(UserProviderController);
  });
});
