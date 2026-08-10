import { Resolver, Query, Args } from '@nestjs/graphql';
import { SkeletonEntity } from './skeleton.entity';
import { SkeletonService } from './skeleton.service';
import { createGenericResolver } from '@nestjs-yalc/graphql/generic.resolver';

const BaseResolver = createGenericResolver(SkeletonEntity, {
  name: 'LowConfigSkeleton',
});

@Resolver(() => SkeletonEntity)
export class LowConfigResolver extends BaseResolver {
  constructor(protected readonly service: SkeletonService) {
    super();
  }

  @Query(() => SkeletonEntity)
  async getLowConfigSkeletonCustom(@Args('id') id: string) {
    return this.service.getEntityAgGrid(id);
  }
}
