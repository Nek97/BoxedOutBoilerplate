import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CURAPP_CONF_ALIAS } from '@boxedout-libs/shared/def.const';
import { IServiceConf } from '@boxedout-libs/shared/conf.type';
import { UserNotFoundException } from './exception/user-not-found.exception';
import { UserPasswordIncorrectException } from './exception/user-password-incorrect.exception';
import { UserPasswordAlreadyUsedException } from './exception/user-password-already-used.exception';
import { UserChangeEmailDto } from './dto/user-change-email.dto';
import { UserSameEmailException } from './exception/user.same.email.exception';

@Injectable()
export class IdentityManagerClientService {
  private readonly identityManagerURL: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.identityManagerURL =
      this.configService.get<IServiceConf & { identityManagerURL: string }>(
        CURAPP_CONF_ALIAS,
      )?.identityManagerURL || '';
  }

  async changeUserPassword(
    guid: string,
    body: UserChangePasswordDto,
    jwt: string,
    userAgent: string,
    originIp: string,
  ) {
    await firstValueFrom(
      this.httpService
        .post<void>(`${this.identityManagerURL}/users/${guid}/password`, body, {
          headers: prepareHeaders(jwt, userAgent, originIp),
        })
        .pipe(
          catchError((e) => {
            if (
              e.response?.status === HttpStatus.NOT_FOUND &&
              e.response?.data?.message?.startsWith('No user found with guid')
            ) {
              throw new UserNotFoundException(guid);
            } else if (
              e.response?.status === HttpStatus.UNAUTHORIZED &&
              e.response?.data?.message?.startsWith('Wrong password')
            ) {
              throw new UserPasswordIncorrectException();
            } else if (
              e.response?.status === HttpStatus.BAD_REQUEST &&
              e.response?.data?.message?.startsWith(
                'Password has previously been used',
              )
            ) {
              throw new UserPasswordAlreadyUsedException();
            } else {
              throw e;
            }
          }),
        ),
    );
  }

  async changeUserEmail(
    guid: string,
    body: UserChangeEmailDto,
    jwt: string,
    userAgent: string,
    originIp: string,
  ) {
    await firstValueFrom(
      this.httpService
        .post<void>(`${this.identityManagerURL}/users/${guid}/email`, body, {
          headers: prepareHeaders(jwt, userAgent, originIp),
        })
        .pipe(
          catchError((e) => {
            if (
              e.response?.status === HttpStatus.NOT_FOUND &&
              e.response?.data?.message?.startsWith('No user found with guid')
            ) {
              throw new UserNotFoundException(guid);
            } else if (
              e.response?.status === HttpStatus.UNAUTHORIZED &&
              e.response?.data?.message?.startsWith('Wrong password')
            ) {
              throw new UserPasswordIncorrectException();
            } else if (
              e.response?.status === HttpStatus.BAD_REQUEST &&
              e.response?.data?.message?.startsWith(
                'Current user email is the same from request',
              )
            ) {
              throw new UserSameEmailException();
            } else {
              throw e;
            }
          }),
        ),
    );
  }
}

function prepareHeaders(jwt: string, userAgent: string, originIp: string) {
  return {
    Authorization: `Bearer ${jwt}`,
    'User-Agent': userAgent,
    'X-Forwarded-For': originIp,
  };
}
