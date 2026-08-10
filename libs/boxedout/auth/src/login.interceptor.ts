import {
  getRequestFromContext,
  getResponseFromContext,
} from '@boxedout-libs/shared/helpers/request-context.helper';
import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IServiceConf } from '@boxedout-libs/shared/conf.type';
import { AuthService, ILoginPayload } from './auth.service';
import { IUserPayload } from './jwt-private.strategy';
import { CURAPP_CONF_ALIAS } from '@boxedout-libs/shared/def.const';

export enum AuthCookiesEnum {
  JWT = '__Secure-JWT',
  CSRF = '__Secure-CSRF',
  EXPIRES = '__Secure-expires',
}

const COOKIE_EXPIRATION_SECONDS = 3600; // 1 hour

@Injectable()
export class LoginInterceptor implements NestInterceptor {
  constructor(
    private authService: AuthService,
    private confService: ConfigService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return next.handle().pipe(map(this.manageResponse(context)));
  }

  /**
   * Checks if there is login data that should be added in the Response as cookies.
   * If the cookies already exist try to renew the cookies.
   * @param context The current execution Context
   */
  manageResponse(context: ExecutionContext) {
    return async (data: any) => {
      // This means the user just logged in
      if (data && data.csrf && data.Authorization) {
        const response = getResponseFromContext(context);
        this.setLoginCookies(response, data.csrf, data.Authorization);
      } else {
        const request = getRequestFromContext(context);

        if (request && 'cookies' in request && 'user' in request) {
          const response = getResponseFromContext(context);
          await this.renewAuthCookies(request, response);
        }
      }

      return data;
    };
  }

  /**
   * Sets the authorization cookies to the Response headers so the Client can store them
   * @param response The current resolved Response
   * @param csrf The CSRF token of the authorization
   * @param jwt The Authorization JWT
   */
  setLoginCookies(response: any, csrf: string, jwt: string): void {
    const expirationTime =
      new Date().getTime() + COOKIE_EXPIRATION_SECONDS * 1000;
    const domain =
      this.confService.get<IServiceConf>(CURAPP_CONF_ALIAS)?.domain ||
      'localhost';

    // Disables the secure Cookie for the local env since we don't have SSL enabled
    const secure = 'Secure;';

    response.raw.setHeader('Set-Cookie', [
      `${AuthCookiesEnum.JWT}=${jwt}; Max-Age=${COOKIE_EXPIRATION_SECONDS}; Domain=${domain}; Path=/; ${secure} HttpOnly; SameSite=Strict;`,
      `${AuthCookiesEnum.CSRF}=${csrf}; Max-Age=${COOKIE_EXPIRATION_SECONDS}; Domain=${domain}; Path=/; ${secure} SameSite=Strict;`,
      `${AuthCookiesEnum.EXPIRES}=${expirationTime}; Max-Age=${COOKIE_EXPIRATION_SECONDS}; Domain=${domain}; Path=/; ${secure} SameSite=Strict;`,
    ]);
  }

  /**
   * Verifies if the request contains Authorization cookies and renews them.
   * Since this renewal is done post-response, this assumes Authorization was handled and user is logged.
   * @param request The current Request
   * @param response The current resolved Response
   */
  async renewAuthCookies(request: any, response: any): Promise<void> {
    const cookies = request.cookies;
    const user: IUserPayload = request.user;

    if (AuthCookiesEnum.JWT in cookies && AuthCookiesEnum.CSRF in cookies) {
      // Extends the existing cookies with logged user
      const authPayload: ILoginPayload | undefined =
        await this.authService.renewJwtTokenForUser(user);
      if (authPayload) {
        this.setLoginCookies(
          response,
          authPayload.csrf,
          authPayload.Authorization,
        );
      }
    }
  }
}
