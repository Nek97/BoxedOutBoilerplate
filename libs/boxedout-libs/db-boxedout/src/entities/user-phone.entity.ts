// @ts-nocheck
import { PhoneValidation } from '@boxedout-libs/shared/app-helpers/custom-validator';
import { Field, HideField, InputType, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserPhoneStatusEnum } from './user-phone.enum';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { formatPhone } from '@boxedout-libs/shared/app-helpers/validator-helper';
import * as crypto from 'crypto';
import { IsEnum } from 'class-validator';

@Index('phone', ['phone'], { unique: true })
@Index('guid', ['guid', 'active'], {})
@Index('guid_2', ['guid', 'token'], {})
@Entity('userPhone')
@ObjectType()
@InputType()
export class UserPhone {
  @HideField()
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @Field({ name: 'userId' })
  @Column('varchar', { name: 'guid', length: 36 })
  guid: string;

  @PhoneValidation({
    message: 'Phone must be a valid phone number',
  })
  @Column('varchar', { name: 'phone', unique: true, length: 100 })
  phone: string;

  @IsEnum(UserPhoneStatusEnum, { each: true })
  @Column({
    name: 'status',
    type: 'enum',
    enum: UserPhoneStatusEnum,
  })
  status: string;

  @Column('int', { name: 'active', default: returnValue("'1'") })
  active: number;

  @HideField()
  @Column('varchar', { name: 'token', length: 40 })
  token: string;

  @Column('timestamp', {
    name: 'timestamp',
    default: returnValue('CURRENT_TIMESTAMP'),
  })
  timestamp: Date;

  @BeforeInsert()
  createTokenAndStatus() {
    this.token = crypto.randomBytes(3).toString('hex').toUpperCase();
    this.status = this.status ?? UserPhoneStatusEnum.PENDING;
  }

  @BeforeInsert()
  @BeforeUpdate()
  createDefaultPhone() {
    this.phone = formatPhone(this.phone).parsedPhoneNumber;
  }
}
