import {
  RoleEnum,
  ALL_ROLES,
  ANY_COMPLIANCE_ROLE,
} from '@boxedout-libs/shared/role.enum';

describe('Roles enum test', () => {
  it('Check definition', async () => {
    expect(RoleEnum).toBeDefined();
    expect(ALL_ROLES).toBeDefined();
    expect(ANY_COMPLIANCE_ROLE).toBeDefined();
  });

  it('Check ANY_COMPLIANCE_ROLE values', async () => {
    Object.values(ANY_COMPLIANCE_ROLE).forEach((role) => {
      expect(role.startsWith('compliance')).toEqual(true);
    });
  });
});
