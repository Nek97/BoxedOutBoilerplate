// @ts-nocheck
import { EventAgGrid } from '@nestjs-yalc/ag-grid/event.enum';
import { LoggerEvent } from '@nestjs-yalc/logger/logger.event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Severity, Span } from '@sentry/types';
import { SentryService } from '../sentry.service';

@Injectable()
export class SentryPlugin {
  private spanMap = new Map<string, Span>();

  constructor(private sentryService: SentryService) {}

  @OnEvent(LoggerEvent.QUERY_LOG)
  async handleLog(query: string) {
    this.sentryService.addBreadcrumb({
      category: LoggerEvent.QUERY_LOG,
      level: Severity.Log,
      message: query,
    });
  }

  @OnEvent(LoggerEvent.QUERY_SLOW)
  async handleSlow(query: string, time: number) {
    this.sentryService.addBreadcrumb({
      category: LoggerEvent.QUERY_SLOW,
      level: Severity.Warning,
      data: {
        time,
      },
      message: query,
    });
  }

  @OnEvent(LoggerEvent.QUERY_ERROR)
  async handleError(query: string, error: string | Error) {
    this.sentryService.addBreadcrumb({
      category: LoggerEvent.QUERY_ERROR,
      level: Severity.Error,
      data: {
        error,
      },
      message: query,
    });
  }

  @OnEvent(EventAgGrid.START_TRANSACTION)
  async handleAgGridTransaction(fieldName: string, id: number) {
    if (this.sentryService.isSetted) {
      const span = this.sentryService.setSpan({
        op: 'dataloader',
        description: fieldName,
      });

      this.spanMap.set(`${fieldName}-${id}`, span);
    }
  }

  @OnEvent(EventAgGrid.END_TRANSACTION)
  async handleAgGridEndTransaction(fieldName: string, id: number) {
    this.spanMap.get(`${fieldName}-${id}`)?.finish();
    this.spanMap.delete(`${fieldName}-${id}`);
  }
}
