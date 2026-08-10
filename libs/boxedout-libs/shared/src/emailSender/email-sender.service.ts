// @ts-nocheck
const EmailDbService = class { getClient() { return { sendEmail: async () => {} }; } };

import { AgGridRepository } from '@nestjs-yalc/ag-grid/ag-grid.repository';
import { pushToAwsSQS } from '@nestjs-yalc/aws-helpers';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { DbConnection } from '../db-default.conf';
import { AwsServiceType } from '../enum';
import { isAwsServiceEnabled } from '../helpers/aws.helper';
import {
  EmailPriority,
  EmailSenderServiceConf,
  ITemplate,
} from './email-sender.def';

@Injectable()
export class EmailSenderService {
  constructor(
    @InjectRepository(EmailQueue, DbConnection.EMAIL)
    private emailQueueRepository: AgGridRepository<EmailQueue>,
    private config?: EmailSenderServiceConf,
  ) {}

  /**
   * Code migrated from v2
   * @param recipient
   * @param template
   * @param priority
   */

  public async sendEmail(
    recipient: string,
    template: ITemplate,
    priority: EmailPriority,
  ) {
    const email: DeepPartial<EmailQueue> = {
      data: template.payload ? JSON.stringify(template.payload) : '',
      template: template.templateType(),
      status: 'pending',
    };

    if (recipient.includes('@')) {
      email.email = recipient;
    } else {
      email.guid = recipient;
    }

    const { identifiers } = await this.emailQueueRepository.insert(email);

    if (isAwsServiceEnabled(AwsServiceType.SQS) && this.config) {
      await pushToAwsSQS(
        {
          endpoint: this.config.sqsEndpoint,
          queueName: priority,
          region: this.config.sqsRegion,
        },
        identifiers[0].toString(),
      );
    }
  }
}
