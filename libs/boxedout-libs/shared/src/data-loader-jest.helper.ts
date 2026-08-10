/* istanbul ignore file */

import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { GQLDataLoader } from '@nestjs-yalc/data-loader/dataloader.helper';
import { default as _Dataloader, BatchLoadFn } from 'dataloader';
import { GenericService } from '../../../common/ag-grid/src/generic-service.service';

const mockedDataLoader = jest.fn(() => createMock<_Dataloader<string, any>>());

jest.mock('dataloader', function () {
  return mockedDataLoader;
});

/**
 * allows to automatically test your standard dataloaders
 * @param dataLoaderClass
 * @param service use this parameter if you need a different type of mocked service
 */
export const dataloaderJestCommonTests = <
  T,
  S extends Record<string, any> = GenericService<T>,
>(
  dataLoaderClass: new (service: S) => GQLDataLoader<T>,
  options?: {
    service?: DeepMocked<S>;
    batchFnName?: keyof S;
  },
) => {
  let dataLoader: GQLDataLoader<T>;

  const keys = ['asset_1', 'asset_2'];

  describe(`${dataLoaderClass.name} dataloader test`, () => {
    beforeEach(() => {
      const mockedService = options?.service ?? createMock<S>();
      mockedService[
        options?.batchFnName ?? 'getEntityListAgGrid'
      ].mockReturnValue(
        new Promise((resolve) => resolve([new Array(keys.length), 0])),
      );
      dataLoader = new dataLoaderClass(mockedService);
    });

    it('should be defined', async () => {
      expect(dataLoader).toBeDefined();
    });

    it('should be able to call the callback', async () => {
      dataLoader.loadOne('fake', {});
      const args = <Array<any>>mockedDataLoader.mock.calls[0];
      const batchFn: BatchLoadFn<string, any> = args[0];
      const results = await batchFn(keys);
      // results are nonsense due to mocking, length should still be same as input though
      expect(results.length).toEqual(2);
    });
  });
};

// just to avoid warning, that no tests in test file
describe('Common tests for dataloaderJestCommonTests implementations', () => {
  test('should be used per implementation', () => {
    // nothing to do
  });
});
