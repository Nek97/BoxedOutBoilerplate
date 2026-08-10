import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest, FastifyReply } from 'fastify';
import { RoleService } from '@boxedout/manage-user/role.service';
import { AuthService } from './auth.service';
import { IJwtPayload, IUserPayload } from './jwt-private.strategy';
import { createPassportContext } from './passport.context';
import { UnauthorizedError } from '@boxedout-libs/errors';
import { isProduction } from '@nestjs-yalc/utils/env.helper';
import { APP_LOGGER_SERVICE } from '@boxedout-libs/shared/def.const';

export const PUBLIC_JWT = 'PublicJwt';

export const getUserCallback =
  (logger: LoggerService) => (_err: any, user: IUserPayload, info: any) => {
    /* istanbul ignore next */ // it's not needed to cover the logger
    info && logger.verbose?.(info);
    return user;
  };

@Injectable()
export class AuthMiddleware
  extends AuthGuard(PUBLIC_JWT)
  implements NestMiddleware
{
  constructor(
    private roleService: RoleService,
    private authService: AuthService,
    @Inject(APP_LOGGER_SERVICE) protected logger: LoggerService,
  ) {
    super();
  }

  async canActivateWithReq(
    request: FastifyRequest,
    response: FastifyReply,
  ): Promise<any> {
    const passportFn = createPassportContext(request, response);
    const user = await passportFn(PUBLIC_JWT, {}, getUserCallback(this.logger));
    return user;
  }

  async use(req: any, res: any, next: () => void) {
    let jwt: string | undefined = undefined;
    let payload: IUserPayload;

    // if the request uses the private jwt, it means that
    // it's a federation request and we have to skip the
    // public jwt checks below
    const token = this.authService.getJwtFromRequest(req);
    if (token && this.authService.isValidPrivateJwt(token)) {
      next();
      return;
    }

    await this.authService.checkAllowedIp(
      this.authService.getIpFromRequest(req),
    );

    const jwtPayload: IJwtPayload = await this.canActivateWithReq(req, res);

    if (jwtPayload) {
      payload = await this.authService.validatePayload(jwtPayload);
      payload.roles = await this.roleService.getEntityList({
        guid: payload.userId,
      });

      await this.authService.checkTwoFactor(payload.userId);

      const validatedReq = await this.authService.validateRequest(req, payload);
      if (!validatedReq) throw new UnauthorizedError('Invalid session');

      jwt = `Bearer ${this.authService.createPrivateJwt(payload)}`;
    }
    req.headers.authorization = jwt;
    next();
  }
}
/**
 * Use this class to allow dev environment to validate public jwt in non-gateway app
 */
export class AuthMiddlewareDev extends AuthMiddleware {
  async use(req: any, res: any, next: () => void) {
    if (isProduction()) {
      next();
      return;
    }

    try {
      await super.use(req, res, next);
    } catch (e) {
      next();
    }
  }
}
