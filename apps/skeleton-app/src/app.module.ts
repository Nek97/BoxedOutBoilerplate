import { Module } from '@nestjs/common';
import { SkeletonResolverModule } from './resolvers/skeleton-resolver.module';

@Module({
  imports: [
    SkeletonResolverModule,
  ],
})
export class AppModule {}
