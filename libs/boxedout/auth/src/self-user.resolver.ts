import { Query, Resolver, ResolveReference } from '@nestjs/graphql';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { UserService } from '@boxedout/manage-user/user.service';
import { UserSelfDataType } from './dto/self-user.type';
import { IUserPayload } from './jwt-private.strategy';
import { CurrentUser } from './gqluser.decorator';
import { AuthenticationError } from 'apollo-server-errors';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './auth.decorator';
import { AuthService } from './auth.service';

@Resolver(returnValue(UserSelfDataType))
export class SelfUserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  /**
   * @todo the following logic should be moved in a service
   */
  private async _getSelfData(user: IUserPayload) {
    const userToReturn: UserSelfDataType = user;
    userToReturn.roleList = [];
    if (user && user.roles) {
      for (const role of user.roles) {
        userToReturn.roleList.push(role.role);
      }
    }
    const userData = await this.userService.getEntityOrFail(
      { guid: user.userId },
      ['firstName'],
    );
    userToReturn.firstName = userData.firstName;
    return userToReturn;
  }

  @Auth([])
  @Query(returnValue(UserSelfDataType), {
    description:
      'Role: none. Retrieves information about the logged in user, so we can customize the frontend based on the roles associated with this account.',
  })
  public async User_getSelfData(
    @CurrentUser() user: IUserPayload,
  ): Promise<UserSelfDataType> {
    return this._getSelfData(user);
  }

  @ResolveReference()
  resolveReference(
    reference: {
      __typename: string;
      userId: string;
    },
    context: any,
  ): Promise<UserSelfDataType> {
    const token = this.authService.getJwtFromRequest(context.req);

    const jwtPaylod = token ? this.jwtService.decode(token) : null;

    if (
      !jwtPaylod ||
      typeof jwtPaylod === 'string' ||
      reference.userId !== jwtPaylod.userId
    )
      throw new AuthenticationError(`Hacking tentative (?)`);

    return this._getSelfData(jwtPaylod as any);
  }
}
