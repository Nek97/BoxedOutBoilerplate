// @ts-nocheck
import returnValue from '@nestjs-yalc/utils/returnValue';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('aid', ['aid'], {})
@Index('guid', ['guid'], {})
@Entity('logsView')
@ObjectType()
export class LogView {
  @HideField()
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @Field({ name: 'adminId' })
  @Column('varchar', { name: 'aid', length: 36, nullable: true })
  aid?: string;

  @Field({ name: 'userId' })
  @Column('varchar', { name: 'guid', length: 36, nullable: true })
  guid?: string;

  @Column('timestamp', {
    name: 'timestamp',
    default: returnValue('CURRENT_TIMESTAMP'),
  })
  timestamp?: Date;

  @Column('varchar', { name: 'ip', length: 50, nullable: true })
  ip?: string;

  @Column('varchar', { name: 'device', length: 40, nullable: true })
  device?: string;

  @Column('varchar', { name: 'type', length: 100, nullable: true })
  type?: string;

  @Column('varchar', { name: 'data', length: 5000, nullable: true })
  data?: string;
}
