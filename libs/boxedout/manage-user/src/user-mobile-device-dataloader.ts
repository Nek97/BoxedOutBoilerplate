import { Injectable, Scope } from '@nestjs/common';
import { UserMobileDevice } from '@boxedout-libs/db-boxedout/entities/user-mobile-device.entity';
import { UserMobileDeviceService } from './user-mobile-device.service';
import { GQLDataLoader } from '@nestjs-yalc/data-loader/dataloader.helper';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable({ scope: Scope.REQUEST })
export class UserMobileDeviceDL extends GQLDataLoader<UserMobileDevice> {
  constructor(
    private userMobileDeviceService: UserMobileDeviceService,
    eventEmitter: EventEmitter2,
  ) {
    super(
      (findManyOptions: AgGridFindManyOptions) =>
        this.userMobileDeviceService.getEntityListAgGrid(findManyOptions, true),
      'guid',
      eventEmitter,
    );
  }
}
