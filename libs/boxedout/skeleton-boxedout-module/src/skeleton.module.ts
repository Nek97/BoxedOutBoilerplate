import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { skeletonUserProvidersFactory } from './skeleton-user.resolver';

@Module({})
export class SkeletonBoxedOutModule {
  static register(dbConnection: string): DynamicModule {
    const skeletonUserProviders = skeletonUserProvidersFactory(dbConnection);

    return {
      module: SkeletonBoxedOutModule,
      imports: [
        TypeOrmModule.forFeature(
          [skeletonUserProviders.repository],
          dbConnection,
        ),
      ],
      providers: [...skeletonUserProviders.providers],
    };
  }
}
