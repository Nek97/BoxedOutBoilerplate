export class UserSameEmailException extends Error {
  constructor() {
    super('Current user email is the same from request');
  }
}
