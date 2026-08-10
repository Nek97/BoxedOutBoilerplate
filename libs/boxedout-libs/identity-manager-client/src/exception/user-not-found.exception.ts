export class UserNotFoundException extends Error {
  constructor(guid: string) {
    super('No user found with guid: ' + guid);
  }
}
