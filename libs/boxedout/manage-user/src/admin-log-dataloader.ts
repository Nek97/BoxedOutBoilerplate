import { Injectable, Scope } from '@nestjs/common';
import { AdminLog } from '@boxedout-libs/db-boxedout/entities/admin-log.entity';
import { AdminLogService } from './admin-log.service';
import { GQLDataLoader } from '@nestjs-yalc/data-loader/dataloader.helper';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable({ scope: Scope.REQUEST })
export class AdminLogDL extends GQLDataLoader<AdminLog> {
  constructor(
    private adminLogService: AdminLogService,
    eventEmitter: EventEmitter2,
  ) {
    super(
      (findManyOptions: AgGridFindManyOptions) =>
        this.adminLogService.getEntityListAgGrid(findManyOptions, true),
      'target',
      eventEmitter,
    );
  }
}
