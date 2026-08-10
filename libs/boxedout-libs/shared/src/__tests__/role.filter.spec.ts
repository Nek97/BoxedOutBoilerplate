import { roleIsComplianceFilter } from '../filters/role.filter';

describe('Role filters test', () => {
  it('roleIsComplianceFilter should work', () => {
    let result = roleIsComplianceFilter('compliance_ofSomething');
    expect(result).toEqual(true);

    result = roleIsComplianceFilter('Something');
    expect(result).toEqual(false);
  });

  it('roleIsComplianceFilter should return true only if role starts with compliance', () => {
    const result = roleIsComplianceFilter('control_compliance');
    expect(result).toEqual(false);
  });
});
