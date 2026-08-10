import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RestAuthGuard extends AuthGuard(['Auth0Jwt', 'PublicJwt']) {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext) {
    if (!(await super.canActivate(context))) {
      return false;
    }
    return true;
  }

  getRequest(context: ExecutionContext) {
    const httpCtx = context.switchToHttp();
    return httpCtx.getRequest();
  }
}
