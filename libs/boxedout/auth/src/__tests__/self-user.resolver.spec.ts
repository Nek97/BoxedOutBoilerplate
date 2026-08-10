import { UserService } from '@boxedout/manage-user/user.service';
import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { SelfUserResolver } from '../self-user.resolver';
import { makeUserPayload } from '../__mocks__/user-payload.mock';

const testWithSelfId = {
  id: 'self',
  mockedUserPayload: makeUserPayload({
    roles: [{ role: 'super_user', guid: 'super_user' }],
  }),
};

const testWithSelfIdNoRoles = {
  id: 'self',
  mockedUserPayload: makeUserPayload(),
};

describe('Test self-user resolver', () => {
  let resolver: SelfUserResolver;
  const mockedJWTService = createMock<JwtService>();
  const mockedAuthService = createMock<AuthService>();

  beforeEach(async () => {
    const mockedUserService = createMock<UserService>();

    resolver = new SelfUserResolver(
      mockedUserService,
      mockedJWTService,
      mockedAuthService,
    );
  });

  it('should get user self data', () => {
    const result = resolver.User_getSelfData(testWithSelfId.mockedUserPayload);
    expect(result).toBeDefined();
  });

  it('should get user self data with no roles', () => {
    const result = resolver.User_getSelfData(
      testWithSelfIdNoRoles.mockedUserPayload,
    );
    expect(result).toBeDefined();
  });

  it('should resolve the reference properly', async () => {
    mockedJWTService.decode.mockReturnValue({ userId: 'testId' });

    const result = await resolver.resolveReference(
      { userId: 'testId' } as any,
      {
        req: { headers: { authorization: 'Bearer fake' } },
      },
    );
    expect(result).toMatchObject({ userId: 'testId' });
  });

  it('should resolve the reference with an error', async () => {
    mockedAuthService.getJwtFromRequest.mockReturnValue(null);

    await expect(async () =>
      resolver.resolveReference({ userId: 'testId' } as any, {
        req: { headers: { authorization: 'Bearer fake' } },
      }),
    ).rejects.toThrowError(`Hacking tentative (?)`);
  });
});
