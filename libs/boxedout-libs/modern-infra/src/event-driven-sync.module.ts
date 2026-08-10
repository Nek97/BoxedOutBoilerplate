// @ts-nocheck
import { Module } from '@nestjs/common';
import { DbSyncService } from './db-sync.service';

/**
 * Modulo dedicato alla sincronizzazione asincrona (Event-Driven) tra database eterogenei.
 * Dimostra il pattern Publish/Subscribe (CDC Applicativo) per risolvere problemi di mapping.
 */
@Module({
  providers: [DbSyncService],
  exports: [DbSyncService],
})
export class EventDrivenSyncModule {}
