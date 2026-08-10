export class UserChangeEmailDto {
  newEmail: string;
  password: string;
  twoFactor?: string;
}
