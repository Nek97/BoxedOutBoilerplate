import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard, RolesGuardRest } from './role.guard';
import { Roles } from './role.decorator';
import { GqlAuthGuard } from './gqlauth.guard';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { RestAuthGuard } from './restauth.guard';

/**
 * Decorator to set the approved role, and after apply GqlAuthguard and RolesGuard.
 *
 *
 * @param roles - the roles for which access to the resource is allowed
 * @return error "Unauthorized" if the required role is missing
 * @return error "Unauthorized" if the jwt token is missing
 *
 */
export function Auth(roles: RoleEnum[]) {
  return applyDecorators(Roles(...roles), UseGuards(GqlAuthGuard, RolesGuard));
}

/**
 * Decorator to set the approved role, and after apply GqlAuthguard and RolesGuard.
 *
 *
 * @param roles - the roles for which access to the resource is allowed
 * @return error "Unauthorized" if the required role is missing
 * @return error "Unauthorized" if the jwt token is missing
 *
 */
export function AuthRest(roles: RoleEnum[] = [] /*, public = false*/) {
  if (roles.length === 0) {
    return applyDecorators(UseGuards(RestAuthGuard));
  } else {
    return applyDecorators(
      Roles(...roles),
      UseGuards(RestAuthGuard, RolesGuardRest),
    );
  }
}
