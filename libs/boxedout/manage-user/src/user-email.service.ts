import { Injectable, Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEmail } from '@boxedout-libs/db-boxedout/entities/user-email.entity';
import { GenericService } from '@nestjs-yalc/ag-grid/generic-service.service';
import { UserEmailRepository } from '@boxedout-libs/db-boxedout/boxedout.repository';

export function UserEmailServiceFactory(boxedoutDbConnName: string): Provider {
  return {
    provide: UserEmailService,
    useFactory: (userEmailRepository: UserEmailRepository) => {
      return new UserEmailService(userEmailRepository);
    },
    inject: [getRepositoryToken(UserEmail, boxedoutDbConnName)],
  };
}

@Injectable()
export class UserEmailService extends GenericService<UserEmail> {
  constructor(userEmailRepository: UserEmailRepository) {
    super(userEmailRepository);
  }

  // At the moment this will always also load the user, since this is only used for login
  async getUserEmail(
    email: string,
    fields?: (keyof UserEmail)[],
  ): Promise<UserEmail | undefined> {
    return this.getEntity({ email, active: 1 }, fields, ['User']);
  }
}
