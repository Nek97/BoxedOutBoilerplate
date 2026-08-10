import { Injectable } from '@nestjs/common';
import { UserEmail } from '@boxedout-libs/db-boxedout/entities/user-email.entity';
import { UserEmailService } from './user-email.service';
import { AgGridFindManyOptions } from '@nestjs-yalc/ag-grid/ag-grid.interface';
import { GQLDataLoader } from '@nestjs-yalc/data-loader/dataloader.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserEmailDL extends GQLDataLoader<UserEmail> {
  constructor(
    private userEmailService: UserEmailService,
    eventEmitter: EventEmitter2,
  ) {
    super(
      (findManyOptions: AgGridFindManyOptions) =>
        this.userEmailService.getEntityListAgGrid(findManyOptions, true),
      'guid',
      eventEmitter,
    );
  }
}
