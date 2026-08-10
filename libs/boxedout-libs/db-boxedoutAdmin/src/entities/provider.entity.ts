// @ts-nocheck
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('name', ['name'], { unique: true })
@Index('accounts', ['accounts'], {})
@Index('actions', ['actions'], {})
@Entity('providers', { schema: 'boxedoutAdmin' })
export class Provider {
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @Column('varchar', { name: 'name', unique: true, length: 190 })
  name: string;

  @Column('int', { name: 'risk' })
  risk: number;

  @Column('int', { name: 'accounts' })
  accounts: number;

  @Column('int', { name: 'actions' })
  actions: number;
}
