import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMobileDevice } from '@boxedout-libs/db-boxedout/entities/user-mobile-device.entity';
import { GenericService } from '@nestjs-yalc/ag-grid/generic-service.service';
import { UserMobileDeviceRepository } from '@boxedout-libs/db-boxedout/boxedout.repository';

@Injectable()
export class UserMobileDeviceService extends GenericService<UserMobileDevice> {
  constructor(
    @InjectRepository(UserMobileDevice, 'boxedoutConnection')
    userMobileDeviceRepository: UserMobileDeviceRepository,
  ) {
    super(userMobileDeviceRepository);
  }
}
