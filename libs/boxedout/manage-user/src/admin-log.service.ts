import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminLog } from '@boxedout-libs/db-boxedout/entities/admin-log.entity';
import { GenericService } from '@nestjs-yalc/ag-grid/generic-service.service';
import { AdminLogRepository } from '@boxedout-libs/db-boxedout/boxedout.repository';

@Injectable()
export class AdminLogService extends GenericService<AdminLog> {
  constructor(
    @InjectRepository(AdminLog, 'boxedoutConnection')
    adminLogRepository: AdminLogRepository,
  ) {
    super(adminLogRepository);
  }
}
