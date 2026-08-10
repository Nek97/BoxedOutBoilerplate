import { ExtractJwt, SecretOrKeyProvider, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { IAuthModuleOptions } from './auth.type';
import { IUserPayload } from './jwt-private.strategy';
import { getCookiesFromRequest } from './auth.service';
import { convertCookies } from '@boxedout-libs/shared/request.helper';

export function jwtExtractor(
  callback: { (req: any): string | null },
  allowHeader: boolean | undefined,
) {
  return (req: any) => {
    const cookies = getCookiesFromRequest(req);
    if (cookies['Mobile']) {
      return cookies['Mobile'];
    } else {
      return !allowHeader || cookies['__Secure-JWT']
        ? cookies['__Secure-JWT']
        : callback(req);
    }
  };
}
@Injectable()
export class JwtPublicStrategy extends PassportStrategy(Strategy, 'PublicJwt') {
  constructor(@Inject('CONFIG_OPTIONS') options: IAuthModuleOptions) {
    super({
      jwtFromRequest: jwtExtractor(
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        !options.isProduction,
      ),
      ignoreExpiration: options.ignoreJwtExpiration,
      secretOrKeyProvider: <SecretOrKeyProvider>((request, _jwt, done) => {
        const cookies = convertCookies(request.headers.cookie);
        if (cookies && cookies['Mobile']) {
          done(null, options.jwtSecretMobile);
        } else {
          done(null, options.jwtSecretPublic);
        }
      }),
    });
  }

  error(/*err*/) {
    //console.log('err ->', err);
  }

  success(user: IUserPayload /*, info*/) {
    return user;
  }

  async validate(payload: IUserPayload) {
    return payload;
  }
}
