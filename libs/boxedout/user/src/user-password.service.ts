import { Injectable } from '@nestjs/common';
import { UserChangePasswordDto } from './dto/user-change-password.type';
import { IdentityManagerClientService } from '@boxedout-libs/identity-manager-client';

@Injectable()
export class UserPasswordService {
  constructor(private identityManagerClient: IdentityManagerClientService) {}

  async changeUserPassword(
    guid: string,
    body: UserChangePasswordDto,
    jwt: string,
    userAgent: string,
    originIp: string,
  ) {
    await this.identityManagerClient.changeUserPassword(
      guid,
      {
        currentPassword: body.password_current,
        newPassword: body.password_new1,
        newPasswordConfirmation: body.password_new2,
      },
      jwt,
      userAgent,
      originIp,
    );
  }
}
