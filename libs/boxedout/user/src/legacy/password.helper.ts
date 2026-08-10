import { USER_PASSWORD_LIMITS } from './constants';
import { InputValidationError } from './common.error';

/**
 * Returns true only if the password is valid, otherwise throws an error
 * @param {string} password
 * @returns {boolean}
 */
const isPasswordValid = (password: any) => {
  if (!password || typeof password !== 'string') {
    throw new InputValidationError('password_empty');
  }

  if (password.length < USER_PASSWORD_LIMITS.MINIMUM_LENGTH) {
    throw new InputValidationError('password_minimal_length');
  }

  if (password.length > USER_PASSWORD_LIMITS.MAXIMUM_LENGTH) {
    throw new InputValidationError('password_too_long');
  }

  return true;
};

/**
 * Returns true only if the password, and the confirmation, is valid, otherwise throws an error
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {boolean}
 */
const isPasswordValidWithConfirmation = (
  password: any,
  confirmPassword: any,
) => {
  isPasswordValid(password);

  if (password !== confirmPassword) {
    throw new InputValidationError('passwords_do_not_match');
  }

  return true;
};

export { isPasswordValid, isPasswordValidWithConfirmation };
