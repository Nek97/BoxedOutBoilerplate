export interface IAuditLogAdmin {
  sessionId: string;
  adminId: string;
}

export interface IAuditLogData {
  arguments: any;
  response: any;
}

export interface IAuditUserLogData {
  [key: string]: any;
}

export enum AuditLogEventType {
  CREATED = 'auditLog.created',
}

export enum AuditUserLogEventType {
  CREATED = 'auditUserLog.created',
}

export class AuditLogEvent {
  constructor(
    public type: string,
    public admin: IAuditLogAdmin,
    public data: IAuditLogData,
    /**
     * target guid
     */
    public targetId?: string,
  ) {}
}
export class AuditUserLogEvent {
  constructor(
    public type: string,
    public data: IAuditLogData,
    public sessionId: string,
    public userAgent: string,
  ) {}
}
