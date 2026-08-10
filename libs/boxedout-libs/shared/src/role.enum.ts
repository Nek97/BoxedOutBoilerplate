import { roleIsComplianceFilter } from './filters/role.filter';

export enum RoleEnum {
  TEST = 'test',
  AGENT = 'agent',
  AFFILIATE = 'affiliate',
  AUDIT_TRANSACTION = 'audit-transaction',
  AUDIT_USER = 'audit-user',
  AUDIT_ADMIN = 'audit-admin',
  COMPLIANCE_ADDRESSBOOK = 'compliance-addressbook',
  COMPLIANCE_BANK = 'compliance-bank',
  COMPLIANCE_ID = 'compliance-id',
  COMPLIANCE_FIU = 'compliance-fiu',
  COMPLIANCE_LOCK = 'compliance-lock',
  COMPLIANCE_MONITOR_USER = 'compliance-monitor-user',
  COMPLIANCE_MONITOR_TRANSACTION = 'compliance-monitor-transaction',
  COMPLIANCE_PROOF_OF_FUNDS = 'compliance-proof-of-funds',
  COMPLIANCE_CONFIRM_LIMITS = 'compliance-confirm-limits',
  COMPLIANCE_QUESTIONNAIRE = 'compliance-questionnaire',
  COMPLIANCE_SANCTIONLIST = 'compliance-sanctionlist',
  COMPLIANCE_TAGS = 'compliance-tags',
  COMPLIANCE_CORPORATE = 'compliance-corporate',
  POLICY_RULES = 'policy-rules',
  POLICY_BLACKLIST = 'policy-blacklist',
  POLICY_RISK_ASSIGNMENTS = 'policy-risk-assignments',
  MANAGEMENT = 'management',
  MANAGEMENT_CUSTODY = 'management-custody',
  USER_WITHDRAWAL_MANAGE = 'user-withdrawal-manage',
  USER_WITHDRAWAL_APPROVE = 'user-withdrawal-approve',
  SUPER_USER = 'super-user',
  SHIFT_LEAD = 'shift-lead',
}

/** Using this variable, anyone with a role can use the endpoint */
const ALL_ROLES = [...Object.values(RoleEnum)];
ALL_ROLES.shift();
export { ALL_ROLES };

/** Using this variable, anyone with a compliance role can use the endpoint */
const ANY_COMPLIANCE_ROLE = [
  ...Object.values(RoleEnum).filter(roleIsComplianceFilter),
];
export { ANY_COMPLIANCE_ROLE };
