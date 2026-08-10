import { ImportType } from '@nestjs-yalc/interfaces/nestjs.type';
import { BaseEntity } from 'typeorm';
import { getTypeOrmImports } from '../module-helper';

describe('data generator helper test', () => {
  it('should return a list of TypeOrmModule imports', () => {
    const imports: ImportType[] = getTypeOrmImports([BaseEntity], ['BTC']);

    expect(imports.length).toBe(1);
  });
});
