import { ErrorsEnum } from '@boxedout-libs/errors/errors.enum';
import * as validatorHelper from '../app-helpers/validator-helper';

describe('Test for the validator helper functions', () => {
  it('Test stringIsEnum', () => {
    const testData = validatorHelper.stringIsInEnum(
      ErrorsEnum.BAD_LOGIN,
      ErrorsEnum,
    );
    expect(testData).toEqual(true);
  });
  it('Test stringIsEnum with a false case', () => {
    const testData = validatorHelper.stringIsInEnum(
      `NotInEnum_${ErrorsEnum.BAD_LOGIN}`,
      ErrorsEnum,
    );
    expect(testData).toEqual(false);
  });
  it('Test stringIsEnumOrThrow', () => {
    const testData = validatorHelper.stringIsInEnumOrThrow(
      ErrorsEnum.BAD_LOGIN,
      ErrorsEnum,
    );
    expect(testData).toEqual(true);
  });
  it('Test stringIsEnumOrThrow with a false case and without a message', () => {
    const toCheck = `NotInEnum_${ErrorsEnum.BAD_LOGIN}`;
    expect.assertions(1);
    try {
      validatorHelper.stringIsInEnumOrThrow(toCheck, ErrorsEnum);
    } catch (err) {
      expect(err).toEqual(new Error(`${ErrorsEnum.INVALID_VALUE} ${toCheck}`));
    }
  });
  it('Test stringIsEnumOrThrow with a false case and with a specified message', () => {
    const toCheck = `NotInEnum_${ErrorsEnum.BAD_LOGIN}`;
    const message = 'messageToThrow';
    expect.assertions(1);
    try {
      validatorHelper.stringIsInEnumOrThrow(toCheck, ErrorsEnum, message);
    } catch (err) {
      expect(err).toEqual(new Error(message));
    }
  });
  it('Test formatPhone', () => {
    try {
      const testData = validatorHelper.formatPhone('+310600000000');
      expect(testData).toBeDefined();
    } catch (err) {
      expect(err).not.toBeDefined();
    }
  });
  it('Test formatPhone with an invalid phone number', () => {
    expect.assertions(1);
    try {
      validatorHelper.formatPhone('invalidPhone');
    } catch (err) {
      expect(err).toEqual(new Error(ErrorsEnum.INVALID_PHONE));
    }
  });
  it('Test validatePhone', () => {
    try {
      const testData = validatorHelper.validatePhone('+310612345678');
      expect(testData).toBeDefined();
    } catch (err) {
      expect(err).not.toBeDefined();
    }
  });
  it('Test validatePhone with unvalid phone', () => {
    expect.assertions(1);
    try {
      validatorHelper.validatePhone('+310000000000');
    } catch (err) {
      expect(err).toEqual(new Error(ErrorsEnum.INVALID_PHONE));
    }
  });
});
