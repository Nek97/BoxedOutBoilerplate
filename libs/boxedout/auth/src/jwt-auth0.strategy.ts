import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { Auth0JwtUser, IAuthModuleOptions } from '@boxedout/auth/auth.type';

@Injectable()
export class JwtAuth0Strategy extends PassportStrategy(Strategy, 'Auth0Jwt') {
  constructor(@Inject('CONFIG_OPTIONS') private options: IAuthModuleOptions) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true, // Prevent DoS attacks
        jwksRequestsPerMinute: 10,
        jwksUri: options.auth0Config?.jwksUri || 'randomValue',
      }),
      ignoreExpiration: options.ignoreJwtExpiration,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: options.auth0Config?.audience,
      issuer: options.auth0Config?.issuer,
      algorithms: ['RS256'],
    });
  }

  validate(payload: any): Auth0JwtUser {
    payload.guid = payload[this.options.auth0Config?.audience || '']['guid'];
    return payload;
  }
}
