import {
  AuditUserLogEvent,
  AuditUserLogEventType,
} from '@boxedout-libs/shared/events/audit-log.event';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { UserService } from '@boxedout/manage-user/user.service';
import { UserLogService } from '@boxedout/manage-user/user-log.service';
import { UserLog } from '@boxedout-libs/db-boxedout';

@Injectable()
export class AuditUserLogListener {
  constructor(
    private userService: UserService,
    private userLogService: UserLogService,
  ) {}

  @OnEvent(AuditUserLogEventType.CREATED)
  async handleOrderCreatedEvent(event: AuditUserLogEvent): Promise<void> {
    // Not sure if we can have multiple sessions per user, but let's use the latest one
    const activeSession = await this.userService.getActiveSession(
      event.sessionId,
    );

    const logAction = new UserLog();
    logAction.guid = activeSession?.guid ?? '';
    logAction.ip = activeSession?.ip ?? '';
    logAction.device = activeSession?.device ?? '';
    logAction.type = event.type;
    logAction.data = JSON.stringify(event.data);
    logAction.userAgent = event.userAgent;

    await this.userLogService.createEntity(logAction, {}, false);
  }
}
