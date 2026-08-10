import { AgGridRepository } from '@nestjs-yalc/ag-grid/ag-grid.repository';
import { ImportType } from '@nestjs-yalc/interfaces/nestjs.type';
import { ClassType } from '@nestjs-yalc/types';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Returns an array of TypeOrmModule imports based in the provided connections and entities
 * @param entities The Array of entities
 * @param connections The Array of connections
 */
export function getTypeOrmImports<Entity = any>(
  connectionAndEntityList: {
    connection: string;
    // entities: EntityClassOrSchema[];
    repositories: ClassType<AgGridRepository<Entity>>[];
  }[],
): ImportType[] {
  const imports: ImportType[] = [];
  // Registers all the Crypto Assets connections to this module
  for (const object of connectionAndEntityList) {
    imports.push(
      TypeOrmModule.forFeature(object.repositories, object.connection),
    );
  }

  return imports;
}
