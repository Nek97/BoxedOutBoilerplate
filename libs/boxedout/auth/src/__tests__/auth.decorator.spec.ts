import { Auth, AuthRest } from '@boxedout/auth/auth.decorator';
import { RolesGuard } from '../role.guard';
import { GqlAuthGuard } from '../gqlauth.guard';
import { createMock } from '@golevelup/ts-jest';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { Reflector } from '@nestjs/core';
import { AuthService } from '@boxedout/auth/auth.service';

describe('Auth decorators test', () => {
  const mocked: RoleEnum[] = [RoleEnum.TEST];
  const newAuthService = createMock<AuthService>();
  const newReflector = createMock<Reflector>(new Reflector());
  createMock<RolesGuard>(new RolesGuard(newReflector, newAuthService));
  createMock<GqlAuthGuard>(new GqlAuthGuard());

  it('Check Auth Module', async () => {
    const testData = Auth(mocked);
    expect(testData).toBeDefined();
  });

  it('Check AuthRest Module', async () => {
    let testData = AuthRest(mocked);
    expect(testData).toBeDefined();

    testData = AuthRest([]);
    expect(testData).toBeDefined();
  });
});
