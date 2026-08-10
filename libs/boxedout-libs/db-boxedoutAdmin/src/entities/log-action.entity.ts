// @ts-nocheck
import returnValue from '@nestjs-yalc/utils/returnValue';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('aid', ['aid'], {})
@Index('guid', ['guid'], {})
@Entity('logsAction')
@ObjectType()
export class LogAction {
  @HideField()
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @Field({ name: 'adminId' })
  @Column('varchar', { name: 'aid', length: 36 })
  aid: string;

  @Field({ name: 'userId' })
  @Column('varchar', { name: 'guid', length: 36 })
  guid: string;

  @Column('timestamp', {
    name: 'timestamp',
    default: returnValue('CURRENT_TIMESTAMP'),
  })
  timestamp: Date;

  @Column('varchar', { name: 'ip', length: 50 })
  ip: string;

  @Column('varchar', { name: 'device', length: 40 })
  device: string;

  @Column('varchar', { name: 'type', length: 100 })
  type: string;

  @Column('varchar', { name: 'data', length: 5000, nullable: true })
  data?: string;
}
