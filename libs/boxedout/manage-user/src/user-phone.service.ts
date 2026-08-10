import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPhone } from '@boxedout-libs/db-boxedout/entities/user-phone.entity';
import { GenericService } from '@nestjs-yalc/ag-grid/generic-service.service';
import { UserPhoneRepository } from '@boxedout-libs/db-boxedout/boxedout.repository';

@Injectable()
export class UserPhoneService extends GenericService<UserPhone> {
  constructor(
    @InjectRepository(UserPhone, 'boxedoutConnection')
    userPhoneRepository: UserPhoneRepository,
  ) {
    super(userPhoneRepository);
  }
}
