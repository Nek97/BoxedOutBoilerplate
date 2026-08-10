// @ts-nocheck
import { registerDecorator, ValidationOptions } from 'class-validator';
import { stringIsInEnum, validatePhone } from './validator-helper';

//This help us to cover each line of code
export const phoneValidatorFactory = () => {
  return {
    validate(value: any) {
      validatePhone(value);
      return true;
    },
  };
};

export const stringIsInEnumValidatorFactory = <T>(property: T) => {
  return {
    validate(value: any) {
      return stringIsInEnum(value, property);
    },
  };
};

export function PhoneValidation(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'phoneValidation',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: phoneValidatorFactory(),
    });
  };
}
