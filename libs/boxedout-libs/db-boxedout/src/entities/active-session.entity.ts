// @ts-nocheck
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('xx', ['xx'], { unique: true })
@Index('guid', ['guid'], { unique: false })
@Entity({ schema: 'boxedout', name: 'activeSessions' })
@ObjectType()
export class ActiveSession {
  @HideField()
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @Field({ name: 'ID' })
  @Column('varchar', { name: 'sessionId', nullable: false, length: 36 })
  sessionId: string;

  @Field({ name: 'userId' })
  @Column('varchar', { name: 'guid', nullable: false, length: 36 })
  guid: string;

  @Column('timestamp', { name: 'timestamp', nullable: false })
  timestamp: string;

  @Column('varchar', { name: 'audience', length: 20 })
  audience: string;

  @Column('varchar', { name: 'device', length: 40 })
  device: string;

  @Column('varchar', { name: 'csrf', length: 80 })
  csrf: string;

  @Column('varchar', { name: 'ip', length: 46 })
  ip: string;

  @Column({ type: 'int', name: 'bruteForceCount' })
  bruteForceCount: number;
}
