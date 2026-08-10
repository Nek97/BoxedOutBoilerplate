import { Injectable } from '@nestjs/common';
import { IdentityManagerClientService } from '@boxedout-libs/identity-manager-client';
import { UserChangeEmailDto } from './dto/user-change-email.type';

@Injectable()
export class UserEmailService {
  constructor(private identityManagerClient: IdentityManagerClientService) {}

  async changeUserEmail(
    guid: string,
    body: UserChangeEmailDto,
    jwt: string,
    userAgent: string,
    originIp: string,
  ) {
    await this.identityManagerClient.changeUserEmail(
      guid,
      {
        newEmail: body.email,
        password: body.password,
        twoFactor: body.twoFactor,
      },
      jwt,
      userAgent,
      originIp,
    );
  }
}
