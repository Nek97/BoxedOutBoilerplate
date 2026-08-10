import { AuthPayload } from '../auth.type';

describe('Auth type test', () => {
  it('should be a valid class which can be instantiated', () => {
    const instance = new AuthPayload();
    expect(instance).toBeInstanceOf(AuthPayload);
  });
});
