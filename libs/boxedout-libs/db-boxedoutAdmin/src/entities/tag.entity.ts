// @ts-nocheck
import {
  Field,
  HideField,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { TagColorEnum } from './tag.enum';

registerEnumType(TagColorEnum, {
  name: 'TagColorEnum',
});

@Index('name', ['name'], {})
@Entity('tagList')
@ObjectType()
export class Tag {
  @HideField()
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @Field({ name: 'ID' })
  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @Column({ name: 'color', type: 'enum', enum: TagColorEnum })
  color: TagColorEnum;

  @Column('varchar', { name: 'description', length: 2000 })
  description: string;
}
