import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UserPasswordService } from '../user-password.service';
import { IdentityManagerClientService } from '@boxedout-libs/identity-manager-client';
import { UserChangePasswordDto } from '@boxedout/user/dto/user-change-password.type';

describe('UserPasswordService test', () => {
  let userPasswordService: UserPasswordService;
  let identityManagerClient: DeepMocked<IdentityManagerClientService>;
  const SOME_GUID = 'f5a1270b-f609-4fdc-acc7-045edaf91451';
  const SOME_JWT = 'eyJhbGci.jM5MDIyfQ.Sk6yJV_adQssw5c';
  const SOME_USER_AGENT = 'Chrome';
  const SOME_IP = '10.0.0.1';

  beforeEach(() => {
    identityManagerClient = createMock<IdentityManagerClientService>();

    userPasswordService = new UserPasswordService(identityManagerClient);
  });

  it('should call identity manager', async () => {
    const body: UserChangePasswordDto = {
      password_current: 'test',
      password_new1: 'test',
      password_new2: 'test',
    };
    await userPasswordService.changeUserPassword(
      SOME_GUID,
      body,
      SOME_JWT,
      SOME_USER_AGENT,
      SOME_IP,
    );
    expect(identityManagerClient.changeUserPassword).toHaveBeenCalledWith(
      SOME_GUID,
      {
        currentPassword: body.password_current,
        newPassword: body.password_new1,
        newPasswordConfirmation: body.password_new2,
      },
      SOME_JWT,
      SOME_USER_AGENT,
      SOME_IP,
    );
  });
});
