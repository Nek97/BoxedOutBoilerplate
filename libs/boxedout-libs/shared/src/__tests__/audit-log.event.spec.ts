import {
  AuditLogEvent,
  AuditUserLogEvent,
  IAuditLogAdmin,
  IAuditLogData,
} from '../events/audit-log.event';
import { LogActionTypeEnum } from '@boxedout-libs/shared/log-action.enum';

describe('AuditLog Event', () => {
  const auditLogData: IAuditLogData = {
    arguments: { arg1: 'chuck' },
    response: { entity: 'testa' },
  };

  it('should be able to create instance of the event', () => {
    const adminUser: IAuditLogAdmin = {
      sessionId: '1234',
      adminId: '1234',
    };

    const event = new AuditLogEvent(
      LogActionTypeEnum.USER_PHONE_UPDATED,
      adminUser,
      auditLogData,
    );
    expect(event).toBeDefined();
  });

  it('should be able to create an instance of AuditUserLogEvent', () => {
    const testData = new AuditUserLogEvent('', auditLogData, '', '');

    expect(testData).toBeDefined();
  });
});
