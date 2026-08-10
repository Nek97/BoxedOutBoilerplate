import { Injectable, Scope } from '@nestjs/common';
import { User } from '@boxedout-libs/db-boxedout/entities/user.entity';
import { UserService } from './user.service';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { GQLDataLoader } from '@nestjs-yalc/data-loader/dataloader.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable({ scope: Scope.REQUEST })
export class UserDL extends GQLDataLoader<User> {
  constructor(private userService: UserService, eventEmitter: EventEmitter2) {
    super(
      (findManyOptions: AgGridFindManyOptions) =>
        this.userService.getEntityListAgGrid(findManyOptions, true),
      'guid',
      eventEmitter,
    );
  }
}
