export class UserPasswordIncorrectException extends Error {
  constructor() {
    super('Wrong password');
  }
}
