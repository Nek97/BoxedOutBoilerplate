// @ts-nocheck
import returnValue from '@nestjs-yalc/utils/returnValue';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('guid', ['guid', 'token', 'active'], {})
@Index('token', ['token'], {})
@Entity('userMobileDevice')
@ObjectType()
export class UserMobileDevice {
  @HideField()
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @Field({ name: 'userId' })
  @Column('varchar', { name: 'guid', length: 36 })
  guid: string;

  @Column('timestamp', {
    name: 'timestamp',
    default: returnValue('CURRENT_TIMESTAMP'),
  })
  timestamp: Date;

  @Column('varchar', { name: 'token', length: 60 })
  token: string;

  @HideField()
  @Column('varchar', { name: 'secret', length: 40 })
  secret: string;

  @Column('int', { name: 'active' })
  active: number;

  @Column('varchar', { name: 'deviceName', length: 100 })
  deviceName: string;

  @Column('text', { name: 'deviceInfo' })
  deviceInfo: string;
}
