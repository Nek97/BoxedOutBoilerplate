import { Module } from '@nestjs/common';
import { ZeroConfigResolver } from './zero-config.resolver';
import { LowConfigResolver } from './low-config.resolver';
import { HighConfigResolver } from './high-config.resolver';
import { SkeletonService } from './skeleton.service';

@Module({
  providers: [
    SkeletonService,
    ZeroConfigResolver,
    LowConfigResolver,
    HighConfigResolver
  ],
})
export class SkeletonResolverModule {}
