// @ts-nocheck
import {
  AgGridField,
  AgGridObject,
} from '@nestjs-yalc/ag-grid/object.decorator';
import { nullableTimestampMiddleware } from '@nestjs-yalc/field-middleware/nullable-timestamp-middleware.helper';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

// TODO: replace these by generalised functions, did not have much luck passing User (type) as parameter.
export const typeCB = () => User;
export const relationCB = (user: User) => user.UserEmail;

@Index('email_2', ['email'], { unique: true })
@Index('email', ['email', 'active'], {})
@Index('guid', ['guid'], {})
@Index('token', ['token'], {})
@Entity({ schema: 'boxedout', name: 'userEmail' })
@ObjectType()
@AgGridObject()
export class UserEmail {
  @HideField()
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @AgGridField({ gqlOptions: { name: 'userId' } })
  @Column('varchar', { name: 'guid', length: 36 })
  guid: string;

  @Column('varchar', { name: 'email', unique: true, length: 191 })
  email: string;

  @Column('varchar', { name: 'status', length: 100 })
  status: string;

  @Column('int', { name: 'active', default: returnValue('1') })
  active: number;

  @Column('int', { name: 'reminded' })
  reminded: number;

  @HideField()
  @Column('varchar', { name: 'token', length: 40 })
  token: string;

  @Column('timestamp', {
    name: 'timestamp',
    default: returnValue('CURRENT_TIMESTAMP'),
  })
  timestamp: Date;

  @Column('timestamp', {
    name: 'lastLoginFailed',
    default: returnValue('CURRENT_TIMESTAMP'),
  })
  lastLoginFailed: Date;

  @Field({ middleware: [nullableTimestampMiddleware] })
  @Column('timestamp', {
    name: 'lastPasswordReset',
    default: returnValue("'0000-00-00 00:00:00'"),
  })
  lastPasswordReset?: Date;

  @Field({ middleware: [nullableTimestampMiddleware] })
  @Column('timestamp', {
    name: 'lastTwoFactorReset',
    default: returnValue("'0000-00-00 00:00:00'"),
  })
  lastTwoFactorReset?: Date;

  @ManyToOne(typeCB, relationCB)
  @JoinColumn({ name: 'guid', referencedColumnName: 'guid' })
  User: User;
}
