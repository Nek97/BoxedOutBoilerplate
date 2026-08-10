import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@boxedout-libs/db-boxedoutAdmin/entities/role.entity';
import { IUserPayload } from './jwt-private.strategy';
import { ROLES_KEY } from './role.decorator';
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { AuthService } from './auth.service';
import { RoleService } from '@boxedout/manage-user/role.service';
import { UserService } from '@boxedout/manage-user/user.service';

export const checkRole = (
  userRoles: Role[],
  requiredRoles: RoleEnum[],
  skipSuperUser: boolean | undefined,
): boolean =>
  userRoles.some((userRole) => {
    if (
      userRole.role.toLocaleLowerCase() === RoleEnum.SUPER_USER.toLowerCase() &&
      skipSuperUser
    ) {
      return true;
    }
    return requiredRoles.some(
      (requiredRole) =>
        requiredRole.toLowerCase() === userRole.role.toLowerCase(),
    );
  });

@Injectable()
export class RolesGuard implements CanActivate {
  public roles: Role[] = [];
  public userId = '';

  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
    const user: IUserPayload = ctx.getContext().req.user;
    if (!user.roles) {
      return false;
    }
    if (this.userId !== user.userId) {
      this.userId = user.userId;
    }

    return checkRole(
      user.roles,
      requiredRoles,
      this.authService.getOptions().disableRoleCheck,
    );
  }
}

@Injectable()
export class RolesGuardRest implements CanActivate {
  public roles: Role[] = [];
  public userId = '';

  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private roleService: RoleService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const ctx = context.switchToHttp();
    const user = ctx.getRequest().user;
    const activeSession = await this.userService.getActiveSession(user.id, [
      'guid',
    ]);

    if (!activeSession) throw new Error('ERROR SESSIOn');
    const userRoles = await this.roleService.getEntityList({
      guid: activeSession.guid,
    });

    if (this.userId !== user.id) {
      this.userId = user.id;
    }

    return checkRole(
      userRoles,
      requiredRoles,
      this.authService.getOptions().disableRoleCheck,
    );
  }
}
