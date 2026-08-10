import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MapperEngine } from '@boxedout-libs/universal-data-mapper';

export interface DbSyncPayload<T = any> {
  sourceDb: string;
  targetDb: string;
  action: 'insert' | 'update' | 'delete';
  entityName: string;
  data: T;
}

@Injectable()
export class DbSyncService {
  private readonly logger = new Logger(DbSyncService.name);

  /**
   * Listens to all sync events starting with 'db.sync.'.
   * Example: emitter.emit('db.sync.insert', payload)
   * 
   * @template TInput - The expected data type of the payload.
   * @param payload - The payload containing the source and target sync details.
   */
  @OnEvent('db.sync.*')
  async handleDbSyncEvent<TInput = any>(payload: DbSyncPayload<TInput>) {
    this.logger.log(`Received Sync event from ${payload.sourceDb} to ${payload.targetDb} [${payload.action}]`);
    
    try {
      // 1. Mapping Phase: Transform the source DB payload into the required target format
      const mappedData = this.mapData<TInput, any>(payload);

      // 2. Write Phase: Save the mapped data to the target database
      await this.syncToTargetDb(payload.targetDb, payload.action, payload.entityName, mappedData);
      
      this.logger.debug(`Sync successfully completed for entity ${payload.entityName}`);
    } catch (error: any) {
      this.logger.error(`Error during synchronization: ${error.message}`, error.stack);
    }
  }

  /**
   * Delegates the data mapping process to the Universal Data Mapper engine.
   * Returns the original JSON if no mapping schema is found.
   * 
   * @template TInput - The source data type.
   * @template TOutput - The expected output type after mapping.
   * @param payload - The synchronization payload containing sourceDb, targetDb, and the data to map.
   * @returns The transformed output.
   */
  private mapData<TInput = any, TOutput = any>(payload: DbSyncPayload<TInput>): TOutput {
    return MapperEngine.execute<TInput, TOutput>(
      payload.sourceDb,
      payload.targetDb,
      payload.entityName,
      payload.data
    );
  }

  /**
   * Executes the actual write operation by injecting the corresponding repositories or models
   * based on the targetDb string.
   * 
   * @template TData - The data payload to write.
   * @param targetDb - The target database (e.g., 'mongodb', 'dynamodb', 'postgres').
   * @param action - The database action to perform ('insert', 'update', 'delete').
   * @param entityName - The name of the table or collection.
   * @param data - The data to synchronize.
   */
  private async syncToTargetDb<TData = any>(targetDb: string, action: string, entityName: string, data: TData) {
    switch(targetDb) {
      case 'mongodb':
        this.logger.debug(`[Mock] Saving document ${entityName} to MongoDB...`);
        // await this.mongoModel.updateOne({ externalId: data.externalId }, data, { upsert: true });
        break;
      case 'dynamodb':
        this.logger.debug(`[Mock] Saving item ${entityName} to DynamoDB...`);
        // await this.dynamoDb.send(new PutCommand({ TableName: entityName, Item: data }));
        break;
      case 'postgres':
        this.logger.debug(`[Mock] Saving record ${entityName} to PostgreSQL...`);
        // await this.pgRepo.save(data);
        break;
      default:
        this.logger.warn(`Target DB ${targetDb} is not supported!`);
    }
  }
}
