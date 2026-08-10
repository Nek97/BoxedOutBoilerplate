import { FastifyRequest } from 'fastify';
import { Auth0JwtUser, LegacyJwtUser } from './auth.type';

export function extractAuth0UserFromRequest(
  request: FastifyRequest,
): Auth0JwtUser | undefined {
  if (!(request as any).user?.sub) {
    return undefined;
  } else {
    return (request as any).user as Auth0JwtUser;
  }
}

export function extractLegacyUserFromRequest(
  request: FastifyRequest,
): LegacyJwtUser | undefined {
  if (!(request as any).user?.id) {
    return undefined;
  } else {
    return (request as any).user as LegacyJwtUser;
  }
}
