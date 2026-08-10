import { AuthRest } from '@boxedout/auth/auth.decorator';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Headers,
  Post,
  Req,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UserChangePasswordDto } from './dto/user-change-password.type';

import { UserPasswordService } from './user-password.service';
import { extractAuth0UserFromRequest } from '@boxedout/auth/auth.utils';
import { BoxedOutLegacyService } from '@boxedout/user/legacy/boxedout-legacy.service';
import { isPasswordValidWithConfirmation } from '@boxedout/user/legacy/password.helper';
import {
  GeneralError,
  IncorrectPasswordError,
  InputValidationError,
} from '@boxedout/user/legacy/common.error';
import { UserNotFoundException } from '@boxedout-libs/identity-manager-client/exception/user-not-found.exception';
import { UserPasswordIncorrectException } from '@boxedout-libs/identity-manager-client/exception/user-password-incorrect.exception';
import { UserPasswordAlreadyUsedException } from '@boxedout-libs/identity-manager-client/exception/user-password-already-used.exception';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '@boxedout/auth/auth.service';

@Controller()
export class UserPasswordController {
  constructor(
    private readonly legacyService: BoxedOutLegacyService,
    private readonly userPasswordService: UserPasswordService,
    private readonly authService: AuthService,
  ) {}

  @Post('/users/v3/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Change the user password' })
  @ApiResponse({
    status: 200,
    description:
      'Will always return status 200, check the message field for the result.',
  })
  @AuthRest()
  async changeUserPassword(
    @Req() request: FastifyRequest,
    @Body() body: UserChangePasswordDto,
    @Headers('user-agent') userAgent: string,
  ) {
    // Request Validation
    if (!body.password_current) {
      throw new InputValidationError('password_empty');
    }
    isPasswordValidWithConfirmation(body.password_new1, body.password_new2);

    const auth0User = extractAuth0UserFromRequest(request);

    let guid: string | undefined;
    if (!auth0User) {
      guid = await this.legacyService.guid(request);
      // Logged legacy user, so update it in legacy also
      await this.legacyService.changeUserPassword(guid, request, body);
    } else {
      guid = auth0User.guid;
    }
    try {
      const originIp = this.authService.getIpFromRequest(request);
      const jwt = this.authService.getJwtFromRequest(request) || '';
      await this.userPasswordService.changeUserPassword(
        guid,
        body,
        jwt,
        userAgent,
        originIp,
      );
    } catch (e: any) {
      if (e instanceof UserPasswordIncorrectException) {
        throw new IncorrectPasswordError('current_password_incorrect');
      }
      if (e instanceof UserPasswordAlreadyUsedException) {
        throw new IncorrectPasswordError('password_already_used');
      }
      // Ignore the exception in case the user doesn't exist in Auth0, otherwise throw
      if (!(e instanceof UserNotFoundException && !auth0User)) {
        throw new GeneralError(e.message);
      }
    }

    return {
      title: 'password_changed_title',
      message: 'password_changed_message',
    };
  }
}
