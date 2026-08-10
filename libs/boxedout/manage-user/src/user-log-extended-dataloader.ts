import { Injectable, Scope } from '@nestjs/common';
import { UserLogExtendedType } from './dto/user-log.type';
import { UserLogService } from './user-log.service';
import { GQLDataLoader } from '@nestjs-yalc/data-loader/dataloader.helper';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable({ scope: Scope.REQUEST })
export class UserLogExtendedDL extends GQLDataLoader<UserLogExtendedType> {
  constructor(
    private userLogService: UserLogService,
    eventEmitter: EventEmitter2,
  ) {
    super(
      (findManyOptions: AgGridFindManyOptions) =>
        this.userLogService.getUserLogExtendedList(findManyOptions, true),
      'guid',
      eventEmitter,
    );
  }
}
