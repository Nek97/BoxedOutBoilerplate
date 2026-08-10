import { Injectable, Scope } from '@nestjs/common';
import { UserDevice } from '@boxedout-libs/db-boxedout/entities/user-device.entity';
import { UserDeviceService } from './user-device.service';
import { GQLDataLoader } from '@nestjs-yalc/data-loader/dataloader.helper';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable({ scope: Scope.REQUEST })
export class UserDeviceDL extends GQLDataLoader<UserDevice> {
  constructor(
    private userDeviceService: UserDeviceService,
    eventEmitter: EventEmitter2,
  ) {
    super(
      (findManyOptions: AgGridFindManyOptions) =>
        this.userDeviceService.getEntityListAgGrid(findManyOptions, true),
      'guid',
      eventEmitter,
    );
  }
}
