import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { GraphQLSchema } from 'graphql';
import { AppContextService } from '../app-helpers/app-context.service';

const mockedGraphQLSchema = createMock<GraphQLSchema>();
describe('App service test', () => {
  let serviceTest: AppContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppContextService],
    }).compile();

    serviceTest = module.get<AppContextService>(AppContextService);
  });

  it('Check handleAfterUserValidation Event', async () => {
    expect(serviceTest).toBeDefined();
    serviceTest.setSchema(mockedGraphQLSchema);

    const testData = serviceTest.schema;
    expect(testData).toEqual(mockedGraphQLSchema);
  });
});
