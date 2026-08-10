// @ts-nocheck
import {
  AgGridField,
  AgGridObject,
} from '@nestjs-yalc/ag-grid/object.decorator';
import { UserIdentityRequestGlobal } from '@boxedout-libs/db-boxedoutAdmin/entities/user-identity-request.entity';
import { decimalMiddleware } from '@nestjs-yalc/field-middleware/decimal-middleware.helper';
import returnValue, { returnProperty } from '@nestjs-yalc/utils/returnValue';
import {
  Field,
  FieldMiddleware,
  Float,
  HideField,
  MiddlewareContext,
  NextFn,
  ObjectType,
} from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEmail } from './user-email.entity';

export const typeCB = () => UserEmail;
export const relationCB = (userEmail: UserEmail) => userEmail.User;

export const phishingMiddleware: FieldMiddleware = async (
  _ctx: MiddlewareContext,
  next: NextFn,
) => {
  const value = await next();
  return typeof value !== 'undefined' && value.length !== 0 ? true : false;
};

@Index('guid', ['guid'], { unique: true })
@Index('created', ['created'], {})
@Index('fullName', ['firstName', 'lastName'], {})
@Entity({ name: 'userList', schema: 'boxedout', database: 'boxedout' })
@ObjectType()
@AgGridObject()
export class User extends BaseEntity {
  @AgGridField({
    isRequired: true,
    denyFilter: true,
  })
  @HideField()
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @AgGridField({ isRequired: true, gqlOptions: { name: 'ID' } })
  @Column('varchar', { name: 'guid', unique: true, length: 36 })
  guid: string;

  @Column('varchar', { name: 'firstName', length: 50 })
  firstName: string;

  @Column('varchar', { name: 'lastName', length: 100 })
  lastName: string;

  @AgGridField({
    denyFilter: true,
  })
  @HideField()
  @Column('mediumtext', { name: 'password' })
  password: string;

  @Column('timestamp', {
    name: 'boxedoutLock',
    nullable: true,
  })
  boxedoutLock?: Date;

  @Column('timestamp', {
    name: 'userLock',
    nullable: true,
  })
  userLock?: Date;



  @Column('timestamp', {
    name: 'created',
    default: returnValue('CURRENT_TIMESTAMP'),
  })
  created: Date;

  @Column('timestamp', { name: 'profileLoaded', nullable: true })
  profileLoaded?: Date;

  @Column('varchar', { name: 'country', length: 10 })
  country: string;

  @Column('varchar', { name: 'language', length: 10 })
  language: string;

  @Column('int', { name: 'twoFactor' })
  twoFactor: number;

  @Column('mediumtext', { name: 'twoFactorKey' })
  twoFactorKey: string;

  @Column('varchar', { name: 'twoFactorLatest', length: 100 })
  twoFactorLatest: string;

  @Field(returnValue(Boolean), { middleware: [phishingMiddleware] })
  @Column('varchar', { name: 'antiPhishing', length: 20 })
  antiPhishing: string;



  @Column('int', {
    name: 'settingsNotifyIncorrectLogin',
    default: returnValue("'1'"),
  })
  settingsNotifyIncorrectLogin: number;

  @Column('int', {
    name: 'settingsNotifyDeposit',
    default: returnValue("'1'"),
  })
  settingsNotifyDeposit: number;

  @Column('int', {
    name: 'settingsNotifyWithdrawal',
    default: returnValue("'1'"),
  })
  settingsNotifyWithdrawal: number;

  @Column('int', {
    name: 'settingsNotifyDistribution',
    default: returnValue("'1'"),
  })
  settingsNotifyDistribution: number;

  @Column('int', { name: 'settingsNewsletter', default: returnValue("'-1'") })
  settingsNewsletter: number;

  @Column('int', {
    name: 'settingsAcceptTransfers',
    default: returnValue("'1'"),
  })
  settingsAcceptTransfers: number;



  @Column('tinyint', { name: 'accountDeleted' })
  accountDeleted: number;

  @Column('tinyint', {
    name: 'addressbookEnabled',
    default: returnValue("'1'"),
  })
  addressbookEnabled: number;



  @Column('int', { name: 'rateLimitRequests', default: returnValue("'1000'") })
  rateLimitRequests: number;

  @Column('int', { name: 'rateLimitOrdersSec', default: returnValue("'100'") })
  rateLimitOrdersSec: number;

  @Column('int', {
    name: 'rateLimitOrdersDay',
    default: returnValue("'100000'"),
  })
  rateLimitOrdersDay: number;

  @OneToMany(typeCB, relationCB)
  @JoinColumn({ name: 'guid', referencedColumnName: 'guid' })
  UserEmail: UserEmail[];
}

/**
 * For cross-database joins
 */
@Entity({ name: 'userList', schema: 'boxedout', database: 'boxedout' })
@ObjectType()
export class UserGlobal extends User {
  @OneToOne(
    /* istanbul ignore next */
    () => UserIdentityRequestGlobal,
    returnProperty<UserIdentityRequestGlobal>('User'),
  )
  @JoinColumn({ name: 'guid', referencedColumnName: 'guid' })
  UserIdentityRequest?: UserIdentityRequestGlobal;
}

/**
 * User Locks Type
 */
export type UserLocks = Pick<
  User,
  | 'boxedoutLock'
>;
