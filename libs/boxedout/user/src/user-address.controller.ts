/* istanbul ignore file */

import { UserAddress } from '@boxedout-libs/db-boxedout';
import { BadRequestError } from '@boxedout-libs/errors/input-validation.error';
import { AuditUserLog } from '@boxedout-libs/shared/interceptors/audit-user-log.interceptor';
import { LogActionTypeEnum } from '@boxedout-libs/shared/log-action.enum';
import { HttpStatus } from '@nestjs/common';

import {
  isMobileRequest,
  setRestResponse,
} from '@boxedout-libs/shared/rest/rest.helper';
import { AuthRest } from '@boxedout/auth/auth.decorator';
import { UserService } from '@boxedout/manage-user/user.service';
import { GenericService } from '@nestjs-yalc/ag-grid/generic-service.service';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Request,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Equal } from 'typeorm';
import {
  restSelect,
  SelfUserAddressDto,
  SelfUserAddressUpdateDto,
} from './dto/user-address.type';

@Controller()
export class UserAddressController {
  constructor(
    @Inject('UserAddressGenericService')
    private userAddressService: GenericService<UserAddress>,
    private userService: UserService,
  ) {}

  @AuthRest()
  @Get('/users/v3/address')
  async _GetAddress(@Request() request: any, @Res() response: any) {
    return this.GetAddress(request, response);
  }

  @AuthRest()
  @Get('/users/address')
  async GetAddress(@Request() request: any, @Res() response: any) {
    const force200Status = !isMobileRequest(request);
    const formatResponse = setRestResponse(response, force200Status);
    const sessionData = await this.userService.getActiveSession(
      request.user.id,
      ['guid'],
    );
    if (typeof sessionData !== 'undefined') {
      return formatResponse({
        success: true,
        data: await this.userAddressService.getEntity(
          {
            guid: Equal(sessionData.guid),
          },
          restSelect,
        ),
      });
    }
    //Is it possible? We check the session with the AuthRest
    else {
      return formatResponse(
        {
          success: false,
          data: {
            generic_error_title: 'Server Error',
            message: 'Unable to find user data',
          },
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @AuthRest()
  @UseInterceptors(
    AuditUserLog(LogActionTypeEnum.USER_ADDRESS_CREATED, {
      isRest: true,
      logBefore: false,
    }),
  )
  @Post('/users/v3/address')
  async _CreateAddress(
    @Request() request: any,
    @Res() response: any,
    @Body() body: SelfUserAddressDto,
  ) {
    return this.CreateAddress(request, response, body);
  }

  @AuthRest()
  @UseInterceptors(
    AuditUserLog(LogActionTypeEnum.USER_ADDRESS_CREATED, {
      isRest: true,
      logBefore: false,
    }),
  )
  @Post('/users/address')
  async CreateAddress(
    @Request() request: any,
    @Res() response: any,
    @Body() body: SelfUserAddressDto,
  ) {
    const force200Status = !isMobileRequest(request);
    const formatResponse = setRestResponse(response, force200Status);
    const sessionData = await this.userService.getActiveSession(
      request.user.id,
      ['guid'],
    );
    if (typeof sessionData !== 'undefined') {
      const userAddress = await this.userAddressService.getEntity(
        {
          guid: Equal(sessionData.guid),
        },
        ['guid'],
      );
      if (!(userAddress && userAddress.guid)) {
        const data: Partial<UserAddress> =
          await this.userAddressService.createEntity(
            {
              guid: sessionData.guid,
              address: body.address_line_one,
              address2: body.address_line_two,
              postalCode: body.address_zip,
              city: body.address_city,
              country: body.address_country,
              verificationStatus: 'not_verified',
            },
            {
              select: restSelect,
            },
            true,
          );
        formatResponse({
          success: true,
          data: data,
        });

        return data;
      } else {
        formatResponse(
          {
            success: false,
            data: {
              generic_error_title: 'Generic error',
              message: 'Each user should have only 1 address',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
        throw new BadRequestError('Each user should have only 1 address');
      }
    }

    //Is it possible? We check the session with the AuthRest
    formatResponse(
      {
        success: false,
        data: {
          generic_error_title: 'Server Error',
          message: 'Unable to find user data',
        },
      },
      HttpStatus.FORBIDDEN,
    );
    throw new Error(
      `Server Error unable to find session data after validated by the auth, sessionId ${request.user.id}`,
    );
  }

  @AuthRest()
  @UseInterceptors(
    AuditUserLog(LogActionTypeEnum.USER_ADDRESS_UPDATED, {
      isRest: true,
      logBefore: false,
    }),
  )
  @Post('/users/v3/address/update')
  async _UpdateAddress(
    @Request() request: any,
    @Res() response: any,
    @Body() body: SelfUserAddressUpdateDto,
  ) {
    return this.UpdateAddress(request, response, body);
  }

  @AuthRest()
  @UseInterceptors(
    AuditUserLog(LogActionTypeEnum.USER_ADDRESS_UPDATED, {
      isRest: true,
      logBefore: false,
    }),
  )
  @Put('/users/v3/address')
  async _PutUpdateAddress(
    @Request() request: any,
    @Res() response: any,
    @Body() body: SelfUserAddressUpdateDto,
  ) {
    return this.UpdateAddress(request, response, body);
  }

  @AuthRest()
  @UseInterceptors(
    AuditUserLog(LogActionTypeEnum.USER_ADDRESS_UPDATED, {
      isRest: true,
      logBefore: false,
    }),
  )
  @Post('/users/address/update')
  async UpdateAddress(
    @Request() request: any,
    @Res() response: any,
    @Body() body: SelfUserAddressUpdateDto,
  ) {
    const force200Status = !isMobileRequest(request);
    const formatResponse = setRestResponse(response, force200Status);
    const sessionData = await this.userService.getActiveSession(
      request.user.id,
      ['guid'],
    );
    if (typeof sessionData !== 'undefined') {
      const userAddress = await this.userAddressService.getEntity(
        {
          guid: Equal(sessionData.guid),
        },
        ['guid', 'address', 'address2', 'city', 'country', 'postalCode'],
      );
      if (userAddress && userAddress.guid) {
        const data: Partial<UserAddress> =
          await this.userAddressService.updateEntity(
            {
              guid: sessionData.guid,
            },
            {
              address: body.address_line_one ?? userAddress.address,
              address2: body.address_line_two ?? userAddress.address2,
              postalCode: body.address_zip ?? userAddress.postalCode,
              city: body.address_city ?? userAddress.city,
              country: body.address_country ?? userAddress.country,
              verificationStatus: 'not_verified',
            },
            {
              select: restSelect,
            },
            true,
          );
        delete data.guid;
        formatResponse({
          success: true,
          data: data,
        });

        return data;
      } else {
        formatResponse(
          {
            success: false,
            data: {
              generic_error_title: 'Generic error',
              message:
                'It is not possible to change an address that does not exist',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
        throw new BadRequestError(
          'It is not possible to change an address that does not exist',
        );
      }
    }

    //Is it possible? We check the session with the AuthRest
    formatResponse(
      {
        success: false,
        data: {
          generic_error_title: 'Server Error',
          message: 'Unable to find user data',
        },
      },
      HttpStatus.FORBIDDEN,
    );
    throw new Error(
      `Server Error unable to find session data after validated by the auth, sessionId ${request.user.id}`,
    );
  }
}
