import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { BaseAppController } from '../app-helpers/base-app.controller';
import { BaseAppService } from '../app-helpers/base-app.service';

class ConcreteController extends BaseAppController {}

describe('test BaseAppController', () => {
  let baseAppController: BaseAppController;

  const helloWorld = 'Hello World';
  let configService: DeepMocked<ConfigService>;
  const service = createMock<BaseAppService>();

  beforeEach(async () => {
    configService = createMock<ConfigService>();

    service.getHello.mockReturnValue(helloWorld);

    baseAppController = new ConcreteController(service, configService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('root', () => {
    it('should return no-name message', () => {
      configService.get.mockReturnValue(null);
      service.getHello.mockImplementation((appName) => appName);
      expect(baseAppController.getHello()).toBe('no-name');
    });

    it('should return the proper message', () => {
      expect(baseAppController.getHello()).toBe(helloWorld);
    });

    it('should not exit the process', () => {
      const spiedProcess = jest.spyOn(process, 'exit');
      configService.get.mockReturnValue({ isDev: false, isTest: false });
      baseAppController.shutdown();
      expect(spiedProcess).not.toHaveBeenCalled();
    });

    it('should exit the process', () => {
      const spiedProcess = jest.spyOn(process, 'exit');
      spiedProcess.mockImplementation();
      configService.get.mockReturnValue({ isDev: true, isTest: true });
      baseAppController.shutdown();
      expect(spiedProcess).toHaveBeenCalledTimes(1);
      expect(spiedProcess).toHaveBeenCalledWith(0);
    });
  });
});
