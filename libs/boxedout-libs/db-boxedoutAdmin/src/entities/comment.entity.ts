// @ts-nocheck
import { defaultDateTransformer } from '@nestjs-yalc/field-middleware/transformer.helper';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('targetGuid', ['targetGuid', 'type'], {})
@Index('agentGuid', ['agentGuid'], {})
@Index('type', ['type', 'id'], {})
@Entity('comments')
@ObjectType()
export class Comment {
  @HideField()
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @Field({ name: 'adminId' })
  @Column('varchar', { name: 'agentGuid', length: 36 })
  agentGuid: string;

  @Field({ name: 'userId' })
  @Column('varchar', { name: 'targetGuid', length: 36 })
  targetGuid: string;

  @Column('varchar', { name: 'type', length: 100 })
  type: string;

  @Field({ name: 'ID' })
  @Column('varchar', { name: 'id', length: 100 })
  id: string;

  @Column('timestamp', {
    name: 'timestamp',
    default: returnValue('CURRENT_TIMESTAMP'),
    transformer: defaultDateTransformer(),
  })
  timestamp: Date;

  @Column('varchar', { name: 'message', length: 12000 })
  message: string;
}
