import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthRest } from '@boxedout/auth/auth.decorator';
import { FastifyRequest } from 'fastify';
import { UserChangeEmailDto } from './dto/user-change-email.type';
import {
  GeneralError,
  IncorrectPasswordError,
  InputValidationError,
  TwoFactorRequiredError,
} from './legacy/common.error';
import { BoxedOutLegacyService } from './legacy/boxedout-legacy.service';
import { ValidationFilters } from './legacy/constants';
import { extractAuth0UserFromRequest } from '@boxedout/auth/auth.utils';
import { UserEmailService } from './user-email.service';
import { UserNotFoundException } from '@boxedout-libs/identity-manager-client/exception/user-not-found.exception';
import { UserPasswordIncorrectException } from '@boxedout-libs/identity-manager-client/exception/user-password-incorrect.exception';
import { UserSameEmailException } from '@boxedout-libs/identity-manager-client/exception/user.same.email.exception';
import { whitelist } from '@boxedout/user/legacy/validation.helper';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '@boxedout/auth/auth.service';

@Controller()
export class UserEmailController {
  constructor(
    private readonly legacyService: BoxedOutLegacyService,
    private readonly userEmailService: UserEmailService,
    private readonly authService: AuthService,
  ) {}

  @Post('/users/v3/email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Change the user email address' })
  @ApiResponse({
    status: 200,
    description:
      'Will always return status 200, check the message field for the result.',
  })
  @AuthRest()
  async changeUserEmail(
    @Req() request: FastifyRequest,
    @Body() body: UserChangeEmailDto,
    @Headers('user-agent') userAgent: string,
  ) {
    // Request validation
    const email = whitelist(body.email, ValidationFilters.EMAIL);
    const password = whitelist(body.password, ValidationFilters.PASSWORD);
    const twoFactor = whitelist(body.twoFactor, ValidationFilters.ALPHANUMERIC);

    if (!email) {
      throw new InputValidationError('email_empty');
    }
    if (!password) {
      throw new InputValidationError('password_empty');
    }

    // Extract guid
    const auth0User = extractAuth0UserFromRequest(request);
    let guid: string | undefined;
    if (!auth0User) {
      // Not an Auth0 user, so extract the legacy way
      guid = await this.legacyService.guid(request);
    } else {
      guid = auth0User.guid;
    }

    try {
      const originIp = this.authService.getIpFromRequest(request);
      const jwt = this.authService.getJwtFromRequest(request) || '';
      // Try to update the user via Identity Manager
      await this.userEmailService.changeUserEmail(
        guid,
        {
          email,
          password,
          twoFactor,
        },
        jwt,
        userAgent,
        originIp,
      );
    } catch (e: any) {
      if (e instanceof UserNotFoundException) {
        // User isn't migrated, so let's update the legacy way
        try {
          await this.legacyService.changeUserEmail(guid, request, {
            email,
            password,
            twoFactor,
          });
        } catch (e: any) {
          if (e instanceof TwoFactorRequiredError) {
            // Absense of two factor should return as 200
            return {
              '2fa': true,
              title: 'two_factor_required_title',
              message: 'two_factor_required_message',
            };
          } else {
            throw new GeneralError(e.message);
          }
        }
      } else if (e instanceof UserPasswordIncorrectException) {
        throw new IncorrectPasswordError('current_password_incorrect');
      } else if (e instanceof UserSameEmailException) {
        throw new InputValidationError('same_email');
      } else {
        throw new GeneralError(e.message);
      }
    }

    return {
      title: 'email_changed_title',
      message: 'email_changed_message',
    };
  }
}
