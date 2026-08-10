// @ts-nocheck
import { Module, Global, CacheModule } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100, // 100 requests per minute
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60, // default cache ttl 60 seconds
      max: 1000, // max 1000 elements
    }),
  ],
  exports: [ThrottlerModule, CacheModule],
})
export class CacheRateModule {}
