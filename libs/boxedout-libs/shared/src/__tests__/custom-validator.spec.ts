import { ErrorsEnum } from '@boxedout-libs/errors/errors.enum';
import * as customValidator from '../app-helpers/custom-validator';
import * as validatorHelper from '../app-helpers/validator-helper';
describe('Test for the custom validator functions', () => {
  it('Test phoneValidatorFactory', () => {
    jest.spyOn(validatorHelper, 'validatePhone').mockReturnValue(null);

    const testDataFunction = customValidator.phoneValidatorFactory();
    const testData = testDataFunction.validate('+393457086780');
    expect(testData).toEqual(true);
  });

  it('Test stringIsInEnumValidatorFactory', () => {
    jest.spyOn(validatorHelper, 'stringIsInEnum').mockReturnValue(true);

    const testDataFunction =
      customValidator.stringIsInEnumValidatorFactory(ErrorsEnum);
    const testData = testDataFunction.validate(ErrorsEnum.BAD_LOGIN);
    expect(testData).toEqual(true);
  });

  it('Test stringIsInEnumValidatorFactory', () => {
    const spiedPhoneValidatorFactory = jest.spyOn(
      customValidator,
      'phoneValidatorFactory',
    );

    const testDataFunction = customValidator.PhoneValidation({});
    testDataFunction({}, '');
    expect(spiedPhoneValidatorFactory).toHaveBeenCalled();
  });
});
