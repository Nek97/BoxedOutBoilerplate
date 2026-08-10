import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { UseInterceptors } from '@nestjs/common';
import * as MobileDetect from 'mobile-detect';
import { AuthService } from '@boxedout/auth/auth.service';
import { AuthPayload } from '@boxedout/auth/auth.type';
import { LoginInterceptor } from '@boxedout/auth/login.interceptor';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { IServiceConf } from '@boxedout-libs/shared/conf.type';
import { GqlGetRequest } from '@nestjs-yalc/graphql/decorators/gqlrequest.decorator';
import { AudienceEnum } from '@boxedout/auth/jwt-private.strategy';
import { AUTH_CONF_ALIAS } from '../../../../apps/user-provider/src/config/service';

@Resolver()
export class LoginResolver {
  constructor(private authService: AuthService, private conf: ConfigService) {}

  @Mutation(returnValue(AuthPayload), {
    deprecationReason: 'Please use User_login mutation instead!',
  })
  @UseInterceptors(LoginInterceptor)
  public async login(
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('addPrefix', {
      nullable: true,
      description: 'Add Bearer prefix to the Authorization token',
    })
    addPrefix: boolean,
    @GqlGetRequest() request: any,
  ): Promise<AuthPayload> {
    return this.User_login(username, password, addPrefix, request);
  }

  @Mutation(returnValue(AuthPayload))
  @UseInterceptors(LoginInterceptor)
  public async User_login(
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('addPrefix', {
      nullable: true,
      description: 'Add Bearer prefix to the Authorization token',
    })
    addPrefix: boolean,
    @GqlGetRequest() request: any,
  ): Promise<AuthPayload> {
    const md = new MobileDetect(request.headers['user-agent']);
    const ip: string = this.authService.getIpFromRequest(request);
    const login = await this.authService.login(
      username,
      password,
      md.mobile() ? AudienceEnum.MOBILE : AudienceEnum.WEBSITE,
      this.conf.get<IServiceConf>(AUTH_CONF_ALIAS)?.domain || 'localhost',
      ip,
      addPrefix,
    );

    return login;
  }
}
