// @ts-nocheck
import { UserPhone } from '../entities/user-phone.entity';
import * as validatorHelper from '@boxedout-libs/shared/app-helpers/validator-helper';
import { UserPhoneStatusEnum } from '../entities/user-phone.enum';
import { ErrorsEnum } from '@boxedout-libs/errors/errors.enum';
describe('UserPhone entity test', () => {
  const testEntity = new UserPhone();
  it('Check createDefaultPhone Functionality with invalid phone', async () => {
    expect.assertions(1);
    try {
      testEntity.createDefaultPhone();
    } catch (err) {
      expect(err).toEqual(new Error(ErrorsEnum.INVALID_PHONE));
    }
  });

  it('Check createDefaultPhone Functionality with valid phone', async () => {
    const testEntityPvt = new UserPhone();
    jest.spyOn(validatorHelper, 'formatPhone').mockReturnValue({
      parsedPhoneNumber: '+31 06 00000000',
      parsedPhone: '+310600000000',
    });
    testEntityPvt.createDefaultPhone();
    expect(testEntityPvt.phone).toEqual('+31 06 00000000');
  });
  it('Check createTokenAndStatus Functionality', async () => {
    const testEntityPvt = new UserPhone();
    testEntityPvt.createTokenAndStatus();
    expect(testEntityPvt.token).toBeDefined();
    expect(testEntityPvt.status).toEqual(UserPhoneStatusEnum.PENDING);
  });

  it('Check createDefaultPhone Functionality with a given status', async () => {
    const testEntityPvt = new UserPhone();
    testEntityPvt.status = UserPhoneStatusEnum.VERIFIED;
    testEntityPvt.createTokenAndStatus();
    expect(testEntityPvt.token).toBeDefined();
    expect(testEntityPvt.status).toEqual(UserPhoneStatusEnum.VERIFIED);
  });
});
