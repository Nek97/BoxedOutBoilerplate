// @ts-nocheck
/* istanbul ignore file */

import { AddressbookReason } from '@boxedout-libs/db-boxedout/entities/addressbook.enum';

export interface EmailSenderServiceConf {
  sqsEndpoint: string;
  sqsRegion: string;
}
export interface EmailSenderModuleOptions {
  awsConfig?: EmailSenderServiceConf;
}

export enum EmailPriority {
  HIGH = 'EmailHighPriority',
}

export interface ITemplate {
  templateType: { (): TemplateTypeEnum };
  payload: any;
}

export enum TemplateTypeEnum {
  ADDRESSBOOK_REJECTED = 'addressbook_rejected',
  ADDRESSBOOK_APPROVED = 'addressbook_approved',
  MULTIPLE_ACCOUNT = 'multiple_account',
  PASSWORD_CHANGED = 'password_changed',
  EMAIL_CHANGED = 'email_changed',
  SIGNUP_IN_USE = 'signup_in_use',
}

export class AddressbookRejectedTemplate implements ITemplate {
  templateType = () => TemplateTypeEnum.ADDRESSBOOK_REJECTED;
  constructor(
    public payload: { asset: string; name: string; reason: AddressbookReason },
  ) {}
}

export class AddressbookApprovedTemplate implements ITemplate {
  templateType = () => TemplateTypeEnum.ADDRESSBOOK_APPROVED;
  constructor(
    public payload: {
      asset: string;
      name: string;
    },
  ) {}
}
/**
 * Multiple Account Template definition
 */

export enum MultipleAccountReasonEnum {
  ACTIVE_ACCOUNT = 'active_account',
  OFFBOARDED_ACCOUNT = 'offboarded_account',
}

export class MultipleAccountTemplate implements ITemplate {
  templateType = () => TemplateTypeEnum.MULTIPLE_ACCOUNT;
  constructor(
    public payload: {
      reason: MultipleAccountReasonEnum;
      solution: MultipleAccountReasonEnum;
    },
  ) {}
}

export class PasswordChangedTemplate implements ITemplate {
  templateType = () => TemplateTypeEnum.PASSWORD_CHANGED;
  constructor(
    public payload: {
      userAgent: string;
      ip: string;
      country: string;
    },
  ) {}
}

export class EmailChangedTemplate implements ITemplate {
  templateType = () => TemplateTypeEnum.EMAIL_CHANGED;
  constructor(
    public payload: {
      language: string;
      confirm: string;
      from: string;
      to: string;
      ip: string;
    },
  ) {}
}

export class SignupInUseTemplate implements ITemplate {
  templateType = () => TemplateTypeEnum.SIGNUP_IN_USE;
  constructor(public payload: void) {}
}
