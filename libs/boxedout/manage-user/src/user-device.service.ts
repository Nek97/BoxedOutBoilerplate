import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDevice } from '@boxedout-libs/db-boxedout/entities/user-device.entity';
import { GenericService } from '@nestjs-yalc/ag-grid/generic-service.service';
import { UserDeviceRepository } from '@boxedout-libs/db-boxedout/boxedout.repository';

@Injectable()
export class UserDeviceService extends GenericService<UserDevice> {
  constructor(
    @InjectRepository(UserDevice, 'boxedoutConnection')
    userDeviceRepository: UserDeviceRepository,
  ) {
    super(userDeviceRepository);
  }
}
