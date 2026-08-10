import { Query, ObjectType, Resolver, Field } from '@nestjs/graphql';
import { AppContextService } from '@boxedout-libs/shared/app-helpers/app-context.service';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { printSubgraphSchema } from '@apollo/subgraph';

@ObjectType()
class Service {
  @Field(returnValue(String))
  sdl!: string;
}

@Resolver()
export class UserProviderResolver {
  constructor(private appContextService: AppContextService) {}

  @Query(returnValue(Service))
  public async _service(): Promise<Service> {
    const gql = this.appContextService.schema;
    return {
      sdl: printSubgraphSchema(gql),
    };
  }
}
