export class UserPasswordAlreadyUsedException extends Error {
  constructor() {
    super('Password has previously been used');
  }
}
