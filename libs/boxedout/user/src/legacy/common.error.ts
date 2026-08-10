import { HttpException, HttpStatus } from '@nestjs/common';

class BoxedOutError extends HttpException {
  constructor(message: string) {
    super({ title: message, message: message }, HttpStatus.OK); // The legacy return 200 even for errors
  }
}

class InputValidationError extends BoxedOutError {
  constructor(message: string) {
    super(message);
  }
}

class AuthError extends BoxedOutError {
  constructor(message: string) {
    super(message);
  }
}

class IncorrectPasswordError extends AuthError {
  constructor(message = 'password_incorrect') {
    super(message);
  }
}

class GeneralError extends BoxedOutError {
  constructor(message = 'generic_error') {
    super(message);
  }
}

class PermissionError extends BoxedOutError {
  constructor(message: string) {
    super(message);
  }
}

class AccountDeletedError extends PermissionError {
  constructor(message = 'account_deleted') {
    super(message);
  }
}

class UserNotFoundError extends BoxedOutError {
  constructor(message = 'user_not_found') {
    super(message);
  }
}

class BoxedOutLockedError extends PermissionError {
  constructor(message = 'boxedout_lock') {
    super(message);
  }
}

class UserLockedError extends PermissionError {
  constructor(message = 'user_lock') {
    super(message);
  }
}

class WithdrawalLockedError extends PermissionError {
  constructor(message = 'withdrawal_lock') {
    super(message);
  }
}

class TwoFactorAuthError extends BoxedOutError {
  constructor(message: string) {
    super(message);
  }
}

class EmptyTokenError extends TwoFactorAuthError {
  constructor(message = 'two_factor_token_empty') {
    super(message);
  }
}

class TwoFactorRequiredError extends TwoFactorAuthError {
  constructor(message = 'two_factor_required') {
    super(message);
  }
}

class TwoFactorNotEnabledError extends TwoFactorAuthError {
  constructor(message = 'two_factor_not_enabled') {
    super(message);
  }
}

class IncorrectTokenError extends TwoFactorAuthError {
  constructor(message = 'two_factor_token_incorrect') {
    super(message);
  }
}

class TokenAlreadyUsedError extends TwoFactorAuthError {
  constructor(message = 'two_factor_already_used') {
    super(message);
  }
}

export {
  InputValidationError,
  IncorrectPasswordError,
  GeneralError,
  AccountDeletedError,
  BoxedOutLockedError,
  UserLockedError,
  WithdrawalLockedError,
  EmptyTokenError,
  TwoFactorNotEnabledError,
  TwoFactorRequiredError,
  IncorrectTokenError,
  TokenAlreadyUsedError,
  UserNotFoundError,
};
