// @ts-nocheck
import returnValue from '@nestjs-yalc/utils/returnValue';
import {
  Field,
  HideField,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AdminLogTypeEnum } from './admin-log.enum';

registerEnumType(AdminLogTypeEnum, {
  name: 'AdminLogTypeEnum',
});

@Index('guid', ['guid'], {})
@Index('target', ['target'], {})
@Index('type', ['type'], {})
@Entity('adminLogs')
@ObjectType()
export class AdminLog {
  @HideField()
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @Field({ name: 'adminId' })
  @Column('varchar', { name: 'guid', length: 36 })
  guid: string;

  @Field({ name: 'userId' })
  @Column('varchar', { name: 'target', length: 36 })
  target: string;

  @Column('timestamp', {
    name: 'timestamp',
    default: returnValue('CURRENT_TIMESTAMP'),
  })
  timestamp: Date;

  @Column('varchar', { name: 'ip', length: 50 })
  ip: string;

  @Column('mediumtext', { name: 'userAgent' })
  userAgent: string;

  @Column({ name: 'type', type: 'enum', enum: AdminLogTypeEnum })
  type: AdminLogTypeEnum;

  @Column('varchar', { name: 'device', length: 40 })
  device: string;

  @Column('mediumtext', { name: 'data' })
  data: string;
}
