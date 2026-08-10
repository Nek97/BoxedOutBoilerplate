import { Injectable, Scope } from '@nestjs/common';
import { UserPhoneService } from './user-phone.service';
import { UserPhone } from '@boxedout-libs/db-boxedout/entities/user-phone.entity';
import { GQLDataLoader } from '@nestjs-yalc/data-loader/dataloader.helper';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable({ scope: Scope.REQUEST })
export class UserPhoneDL extends GQLDataLoader<UserPhone> {
  constructor(
    private userPhoneService: UserPhoneService,
    eventEmitter: EventEmitter2,
  ) {
    super(
      (findManyOptions: AgGridFindManyOptions) =>
        this.userPhoneService.getEntityListAgGrid(findManyOptions, true),
      'guid',
      eventEmitter,
    );
  }
}
