import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload {
  @Field()
  public Authorization: string;
  public csrf: string;
}

export interface IAuthModuleOptions {
  ignoreJwtExpiration?: boolean;
  jwtSecretPrivate?: string;
  jwtSecretPublic?: string;
  jwtSecretMobile?: string;
  jwtIssuer?: string;
  allowLocalhost?: boolean;
  isTest?: boolean;
  isPipeline?: boolean;
  isProduction?: boolean;
  disableRoleCheck?: boolean;
  withDbConnection?: boolean;
  auth0Config?: IAuth0Config;
}

export interface IAuth0Config {
  jwksUri: string;
  audience: string;
  issuer: string;
}

export interface Auth0JwtUser {
  guid: string;
  iss: string; // Issuer
  sub: string; // User ID
  aud: string[]; // Audience
  iat: number; // Issued at
  exp: number; // Expiration
  azp: string;
  scope: string;
  permissions: string[]; // User roles
}

export interface LegacyJwtUser {
  id: string; // Session id
  aud: string; // Audience
  iss: string; // Issuer
  iat: number; // Issued at
}
