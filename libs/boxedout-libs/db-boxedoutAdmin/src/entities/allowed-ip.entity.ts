// @ts-nocheck
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@ObjectType()
@Index('ip', ['ip'], { unique: true })
@Entity('allowedIps', { schema: 'boxedoutAdmin' })
export class AllowedIp {
  @Field()
  @PrimaryColumn({ type: 'varchar', name: 'ip', length: 100 })
  ip: string;

  @Field()
  @Column('varchar', { name: 'description', length: 200 })
  description: string;
}
