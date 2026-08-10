import { Resolver } from '@nestjs/graphql';
import { SkeletonEntity } from './skeleton.entity';
import { SkeletonService } from './skeleton.service';
import { createGenericResolver } from '@nestjs-yalc/graphql/generic.resolver';

const BaseResolver = createGenericResolver(SkeletonEntity);

@Resolver(() => SkeletonEntity)
export class ZeroConfigResolver extends BaseResolver {
  constructor(protected readonly service: SkeletonService) {
    super();
  }
}
