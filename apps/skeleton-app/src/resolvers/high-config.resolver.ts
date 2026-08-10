import { Resolver, Query, Args } from '@nestjs/graphql';
import { SkeletonEntity } from './skeleton.entity';
import { SkeletonService } from './skeleton.service';
import { createGenericResolver } from '@nestjs-yalc/graphql/generic.resolver';
import { UseGuards, UseInterceptors } from '@nestjs/common';

const BaseResolver = createGenericResolver(SkeletonEntity, {
  name: 'HighConfigSkeleton',
  // Simulate high config by overriding generic options
  enableGrid: true,
  enableCount: true,
});

@Resolver(() => SkeletonEntity)
export class HighConfigResolver extends BaseResolver {
  constructor(protected readonly service: SkeletonService) {
    super();
  }

  @Query(() => SkeletonEntity)
  async getHighConfigSkeletonCustom(
    @Args('id') id: string,
    @Args('customOption', { nullable: true }) customOption?: string,
  ) {
    // Add custom business logic
    if (customOption) {
      console.log('Custom option used:', customOption);
    }
    return this.service.getEntityAgGrid(id);
  }
}
