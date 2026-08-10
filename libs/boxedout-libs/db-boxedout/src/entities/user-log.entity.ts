// @ts-nocheck
import { IpGlobal } from '@boxedout-libs/db-fraudPrevention/entities/ip.entity';
import returnValue, { returnProperty } from '@nestjs-yalc/utils/returnValue';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import {
  AfterLoad,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UAParser } from 'ua-parser-js';

@Index('type', ['type'], {})
@Index('device', ['device'], {})
@Index('guid', ['guid'], {})
@Index('ip', ['ip'], {})
@Index('timestamp', ['timestamp'], {})
@Entity('userLogs')
@ObjectType()
export class UserLog {
  @HideField()
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @Field({ name: 'userId' })
  @Column('varchar', { name: 'guid', length: 36, nullable: true })
  guid: string;

  @Column('timestamp', {
    name: 'timestamp',
    default: returnValue('CURRENT_TIMESTAMP'),
    nullable: true,
  })
  timestamp: Date;

  @Column('varchar', { name: 'ip', length: 50, nullable: true })
  ip: string;

  @Column('mediumtext', { name: 'userAgent', nullable: true })
  userAgent: string;

  @Column('varchar', { name: 'type', length: 100, nullable: true })
  type: string;

  @Column('varchar', { name: 'device', length: 64, nullable: true })
  device?: string;

  @Column('varchar', { name: 'data', length: 10000, nullable: true })
  data?: string;

  @AfterLoad()
  public setDeviceName() {
    if (!this.userAgent) return;

    const parser = new UAParser();
    const { name: osName, version: osVersion } = parser
      .setUA(this.userAgent)
      .getOS();
    this.device = `${osName} ${osVersion}`;

    const { name: browserName, version: browserVersion } = parser.getBrowser();
    this.userAgent = `${browserName} ${browserVersion}`;
  }
}

// GLOBAL HERE
@Entity('userLogs', { schema: 'boxedout', database: 'boxedout' })
@ObjectType()
export class UserLogGlobal extends UserLog {
  @OneToOne(
    /* istanbul ignore next */
    () => IpGlobal,
    returnProperty<IpGlobal>('UserLog'),
  )
  @JoinColumn({ name: 'ip', referencedColumnName: 'ip' })
  UserIp: IpGlobal;
}
