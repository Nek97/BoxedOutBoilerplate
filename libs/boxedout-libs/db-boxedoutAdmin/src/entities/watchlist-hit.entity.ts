// @ts-nocheck
import returnValue from '@nestjs-yalc/utils/returnValue';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('guid_2', ['guid', 'possibleMatch'], { unique: true })
@Index('guid', ['guid'], {})
@Index('cleared', ['cleared'], {})
@Entity('watchlistHits', { schema: 'boxedoutAdmin' })
@ObjectType()
export class WatchlistHit {
  @HideField()
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @Column('timestamp', {
    name: 'timestamp',
    default: returnValue('CURRENT_TIMESTAMP'),
  })
  timestamp: Date;

  @Field({ name: 'userId' })
  @Column('varchar', { name: 'guid', length: 36 })
  guid: string;

  @Column('varchar', { name: 'possibleMatch', length: 250 })
  possibleMatch: string;

  @Column('tinyint', { name: 'cleared' })
  cleared: number;
}
