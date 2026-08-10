import { UserSelfDataType } from '../dto/self-user.type';

describe('Self user type dto test', () => {
  it('Check Dto User self data', async () => {
    const testData = new UserSelfDataType();

    expect(testData).toBeInstanceOf(UserSelfDataType);
  });
});
