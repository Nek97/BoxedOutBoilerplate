// @ts-nocheck
import { PubSubService } from '@boxedout-libs/redis';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { makePubSubService, RedisModule } from '../redis.module';

describe('RedisModule', () => {
  it('should be defined', async () => {
    const module = new RedisModule();
    expect(module).toBeDefined();
  });

  it('should provide PubSubService from a ConfigService', async () => {
    const redisConfig = {
      enabled: true,
      host: 'TEST_REDIS_HOST',
      port: 60000,
    };

    const mockedPubSubService = createMock<PubSubService>();
    const spiedInitFn = jest.spyOn(PubSubService, 'init');
    spiedInitFn.mockImplementation(() => {});
    const spiedGetIntanceFn = jest.spyOn(PubSubService, 'getInstance');
    spiedGetIntanceFn.mockImplementation(() => mockedPubSubService);

    const mockedConfig = createMock<ConfigService>();
    mockedConfig.get.mockReturnValue({
      redisConfig,
    });

    await makePubSubService(mockedConfig);
    expect(spiedInitFn).toHaveBeenCalledWith(redisConfig);
    expect(spiedGetIntanceFn).toHaveBeenCalled();

    // test when disabled

    redisConfig.enabled = false;

    let service = await makePubSubService(mockedConfig);
    expect(service).toBeNull();

    mockedConfig.get.mockReturnValue({
      redisConfig: null,
    });

    service = await makePubSubService(mockedConfig);
    expect(service).toBeNull();
  });
});
