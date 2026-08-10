import { Injectable, Logger, Inject } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { MapperEngine } from '@boxedout-libs/universal-data-mapper';

export interface DbSyncPayload<T = Record<string, unknown>> {
  sourceDb: string;
  targetDb: string;
  action: 'insert' | 'update' | 'delete';
  entityName: string;
  data: T;
}

@Injectable()
export class DbSyncService {
  readonly #logger = new Logger(DbSyncService.name);

  constructor(@Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2) {}

  /**
   * Listens to all sync events starting with 'db.sync.'.
   * Example: emitter.emit('db.sync.insert', payload)
   * 
   * @param payload - The payload containing the source and target sync details.
   */
  @OnEvent('db.sync.*')
  async handleDbSyncEvent<TInput = Record<string, unknown>>(payload: DbSyncPayload<TInput>): Promise<void> {
    this.#logger.log(`Received Sync event from ${payload.sourceDb} to ${payload.targetDb} [${payload.action}]`);
    
    try {
      // 1. Mapping Phase: Transform the source DB payload into the required target format
      const mappedData = this.mapData<TInput, Record<string, unknown>>(payload);

      // 2. Write Phase: Delegate using a modern event-based Strategy pattern
      const targetEventName = `db.write.${payload.targetDb}`;
      const responses = await this.eventEmitter.emitAsync(targetEventName, {
        action: payload.action,
        entityName: payload.entityName,
        data: mappedData,
      });
      
      if (responses.length === 0) {
        this.#logger.warn(`No handler registered for target DB ${payload.targetDb} (event: ${targetEventName})`);
      } else {
        this.#logger.debug(`Sync successfully completed for entity ${payload.entityName}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.#logger.error(`Error during synchronization: ${error.message}`, error.stack);
      } else {
        this.#logger.error(`Unknown error during synchronization`, error);
      }
    }
  }

  /**
   * Delegates the data mapping process to the Universal Data Mapper engine.
   * Returns the original JSON if no mapping schema is found.
   * 
   * @param payload - The synchronization payload containing sourceDb, targetDb, and the data to map.
   * @returns The transformed output.
   */
  private mapData<TInput = Record<string, unknown>, TOutput = Record<string, unknown>>(payload: DbSyncPayload<TInput>): TOutput {
    return MapperEngine.execute<TInput, TOutput>(
      payload.sourceDb,
      payload.targetDb,
      payload.entityName,
      payload.data
    );
  }
}
