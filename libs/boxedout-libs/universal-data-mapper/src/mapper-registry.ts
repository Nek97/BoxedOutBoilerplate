import { MappingSchema } from './mapping-schema.interface';
import { Logger } from '@nestjs/common';

export class MapperRegistry {
  private static readonly logger = new Logger(MapperRegistry.name);
  
  /**
   * Internal map storing schemas.
   * Format: `sourceDb:targetDb:entityName` -> MappingSchema
   */
  private static maps = new Map<string, MappingSchema>();

  private static buildKey(sourceDb: string, targetDb: string, entity: string): string {
    return `${sourceDb}:${targetDb}:${entity}`;
  }

  /**
   * Registers a new mapping schema for data transformation across different databases.
   * This is typically called during the bootstrap or module initialization phase.
   * 
   * @param sourceDb - The origin database identifier (e.g., 'postgres', 'mysql')
   * @param targetDb - The destination database identifier (e.g., 'mongodb', 'dynamodb')
   * @param entity - The entity name or collection name
   * @param schema - The mapping rules to transform the entity payload
   */
  static register(sourceDb: string, targetDb: string, entity: string, schema: MappingSchema): void {
    const key = this.buildKey(sourceDb, targetDb, entity);
    this.maps.set(key, schema);
    this.logger.log(`Mapping schema registered: [${key}]`);
  }

  /**
   * Retrieves a previously registered mapping schema.
   * 
   * @param sourceDb - The origin database identifier
   * @param targetDb - The destination database identifier
   * @param entity - The entity name or collection name
   * @returns The corresponding MappingSchema or undefined if not found
   */
  static getMap(sourceDb: string, targetDb: string, entity: string): MappingSchema | undefined {
    const key = this.buildKey(sourceDb, targetDb, entity);
    return this.maps.get(key);
  }
}
