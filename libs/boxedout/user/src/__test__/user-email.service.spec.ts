import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { IdentityManagerClientService } from '@boxedout-libs/identity-manager-client';
import { UserEmailService } from '@boxedout/user/user-email.service';
import { UserChangeEmailDto } from '@boxedout/user/dto/user-change-email.type';

describe('UserEmailService test', () => {
  let userEmailService: UserEmailService;
  let identityManagerClient: DeepMocked<IdentityManagerClientService>;
  const SOME_GUID = 'f5a1270b-f609-4fdc-acc7-045edaf91451';
  const SOME_JWT = 'eyJhbGci.jM5MDIyfQ.Sk6yJV_adQssw5c';
  const SOME_USER_AGENT = 'Chrome';
  const SOME_IP = '10.0.0.1';

  beforeEach(() => {
    identityManagerClient = createMock<IdentityManagerClientService>();

    userEmailService = new UserEmailService(identityManagerClient);
  });

  it('should call identity manager', async () => {
    const body: UserChangeEmailDto = {
      password: 'test',
      email: 'test@test.com',
    };
    await userEmailService.changeUserEmail(
      SOME_GUID,
      body,
      SOME_JWT,
      SOME_USER_AGENT,
      SOME_IP,
    );
    expect(identityManagerClient.changeUserEmail).toHaveBeenCalledWith(
      SOME_GUID,
      {
        newEmail: body.email,
        password: body.password,
        twoFactor: body.twoFactor,
      },
      SOME_JWT,
      SOME_USER_AGENT,
      SOME_IP,
    );
  });
});
