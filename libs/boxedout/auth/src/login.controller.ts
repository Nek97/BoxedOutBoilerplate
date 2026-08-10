import { Body, Controller, Post, Request, Res } from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { AuthService } from './auth.service';
import { AudienceEnum } from './jwt-private.strategy';

export enum AuthCookiesEnum {
  JWT = 'Secure-JWT',
  CSRF = 'Secure-CSRF',
  EXPIRES = 'Secure-expires',
}

const COOKIE_EXPIRATION_SECONDS = 3600; // 1 hour

export function setLoginCookies(
  response: any,
  csrf: string,
  jwt: string,
): void {
  const expirationTime =
    new Date().getTime() + COOKIE_EXPIRATION_SECONDS * 1000;
  const domain = 'localhost';

  // Disables the secure Cookie for the local env since we don't have SSL enabled
  const secure = '';

  response.raw.setHeader('Set-Cookie', [
    `${AuthCookiesEnum.JWT}=${jwt}; Max-Age=${COOKIE_EXPIRATION_SECONDS}; Domain=${domain}; Path=/; ${secure} SameSite=Strict; Secure;`,
    `${AuthCookiesEnum.CSRF}=${csrf}; Max-Age=${COOKIE_EXPIRATION_SECONDS}; Domain=${domain}; Path=/; ${secure} SameSite=Strict; Secure;`,
    `${AuthCookiesEnum.EXPIRES}=${expirationTime}; Max-Age=${COOKIE_EXPIRATION_SECONDS}; Domain=${domain}; Path=/; ${secure} SameSite=Strict; Secure;`,
  ]);
}
export function getIss(domain: string | undefined): string {
  return domain || 'localhost';
}
class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
@Controller()
export class LoginController {
  constructor(private authService: AuthService) {}

  @Post('/users/login')
  // @HttpCode(200)
  async login(
    @Request() request: any,
    @Body() body: LoginDto,
    @Res() response: any,
  ) {
    const ip: string = this.authService.getIpFromRequest(request);
    const login = await this.authService.login(
      body.email,
      body.password,
      AudienceEnum.WEBSITE, //mobile
      getIss(process.env.JWT_ISSUER),
      ip,
      true, //addPrefix
    );
    setLoginCookies(response, login.csrf, login.Authorization);

    return response.status(200).send({
      success: true,
      data: { action: 'login', analytics: '00000000000000000000000000000000' },
    });
  }
}
