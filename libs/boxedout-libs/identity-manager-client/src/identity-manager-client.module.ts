import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IdentityManagerClientService } from './identity-manager-client.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 15000,
      }),
    }),
    ConfigService,
  ],
  providers: [IdentityManagerClientService],
  exports: [IdentityManagerClientService],
})
export class IdentityManagerClientModule {}
