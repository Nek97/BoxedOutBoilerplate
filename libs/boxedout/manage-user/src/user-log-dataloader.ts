import { Injectable, Scope } from '@nestjs/common';
import { UserLog } from '@boxedout-libs/db-boxedout/entities/user-log.entity';
import { UserLogService } from './user-log.service';
import { GQLDataLoader } from '@nestjs-yalc/data-loader/dataloader.helper';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable({ scope: Scope.REQUEST })
export class UserLogDL extends GQLDataLoader<UserLog> {
  constructor(
    private userLogService: UserLogService,
    eventEmitter: EventEmitter2,
  ) {
    super(
      (findManyOptions: AgGridFindManyOptions) =>
        this.userLogService.getEntityListAgGrid(findManyOptions, true),
      'guid',
      eventEmitter,
    );
  }
}
