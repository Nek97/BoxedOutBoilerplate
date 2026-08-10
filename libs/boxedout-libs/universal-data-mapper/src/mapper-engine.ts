import { MapperRegistry } from './mapper-registry';
import { Logger } from '@nestjs/common';
import * as _ from 'lodash';

export class MapperEngine {
  private static readonly logger = new Logger(MapperEngine.name);

  /**
   * Executes the transformation of the input data (e.g., SQL join result or standard object)
   * into an intermediate JSON structure based on the registered mapping schema.
   *
   * @template TInput - The type of the source data payload.
   * @template TOutput - The type of the resulting mapped data (defaults to any).
   * 
   * @param sourceDb - The origin database identifier (e.g., 'mysql', 'postgres').
   * @param targetDb - The destination database identifier (e.g., 'mongodb', 'dynamodb').
   * @param entity - The name of the entity being mapped.
   * @param sourcePayload - The original data payload to be transformed.
   * @returns The transformed payload according to the mapping schema, or the original payload if no schema is found.
   */
  static execute<TInput = any, TOutput = any>(sourceDb: string, targetDb: string, entity: string, sourcePayload: TInput): TOutput {
    const schema = MapperRegistry.getMap(sourceDb, targetDb, entity);
    
    if (!schema) {
      this.logger.warn(`No mapping schema found for [${sourceDb}:${targetDb}:${entity}]. Returning original payload.`);
      return sourcePayload as unknown as TOutput;
    }

    const result: any = {};

    // Apply default values first
    if (schema.defaults) {
      Object.assign(result, schema.defaults);
    }

    // Apply mapping rules for each defined field
    for (const [targetKey, mappingRule] of Object.entries(schema.fields)) {
      try {
        if (typeof mappingRule === 'string') {
          // Use lodash.get to extract potentially nested values (e.g., 'profile.address.city')
          const value = _.get(sourcePayload, mappingRule);
          
          if (value !== undefined) {
             // Use lodash.set to assign to potentially nested target keys (e.g., 'metadata.createdAt')
             _.set(result, targetKey, value);
          }
        } else if (typeof mappingRule === 'function') {
          // Custom mapping function (useful for date transformations, string concatenations, etc.)
          const value = mappingRule(sourcePayload);
          if (value !== undefined) {
             _.set(result, targetKey, value);
          }
        }
      } catch (e: any) {
        this.logger.error(`Error mapping field '${targetKey}': ${e.message}`);
      }
    }

    return result as TOutput;
  }
}
