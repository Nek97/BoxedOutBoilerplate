const schema = 'schema representation';

jest.mock('@apollo/subgraph', () => ({
  ...jest.requireActual<any>('@apollo/subgraph'),
  printSubgraphSchema: jest.fn().mockReturnValue(schema),
}));

import { UserProviderResolver } from '../user-provider.resolver';
import { createMock } from '@golevelup/ts-jest';
import { AppContextService } from '@boxedout-libs/shared/app-helpers/app-context.service';

describe('UserProviderResolver test', () => {
  it('Should have a _service resolver', async () => {
    const mockedContextService = createMock<AppContextService>();
    const resolverTest = new UserProviderResolver(mockedContextService);

    const _serviceTypeTest = await resolverTest._service();
    expect(_serviceTypeTest).toStrictEqual({
      sdl: schema,
    });
  });
});
