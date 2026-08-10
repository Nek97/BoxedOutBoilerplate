import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DbSyncService, DbSyncPayload } from '../db-sync.service';
import { MapperEngine } from '@boxedout-libs/universal-data-mapper';

// Mock the external MapperEngine
jest.mock('@boxedout-libs/universal-data-mapper', () => ({
  MapperEngine: {
    execute: jest.fn(),
  },
}));

describe('DbSyncService', () => {
  let service: DbSyncService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DbSyncService,
        {
          provide: EventEmitter2,
          useValue: {
            emitAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DbSyncService>(DbSyncService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleDbSyncEvent', () => {
    const mockPayload: DbSyncPayload = {
      sourceDb: 'postgres',
      targetDb: 'mongodb',
      action: 'insert',
      entityName: 'User',
      data: { id: 1, name: 'Alice' },
    };

    it('should map data and emit the target write event', async () => {
      const mappedData = { externalId: 1, fullName: 'Alice' };
      (MapperEngine.execute as jest.Mock).mockReturnValue(mappedData);
      (eventEmitter.emitAsync as jest.Mock).mockResolvedValue(['response1']); // Simulating a handler registered

      await service.handleDbSyncEvent(mockPayload);

      expect(MapperEngine.execute).toHaveBeenCalledWith(
        mockPayload.sourceDb,
        mockPayload.targetDb,
        mockPayload.entityName,
        mockPayload.data
      );

      expect(eventEmitter.emitAsync).toHaveBeenCalledWith('db.write.mongodb', {
        action: 'insert',
        entityName: 'User',
        data: mappedData,
      });
    });

    it('should handle errors gracefully without throwing', async () => {
      const error = new Error('Mapping failed');
      (MapperEngine.execute as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Should not throw, should be caught and logged
      await expect(service.handleDbSyncEvent(mockPayload)).resolves.not.toThrow();
      expect(eventEmitter.emitAsync).not.toHaveBeenCalled();
    });

    it('should handle unhandled target DB gracefully', async () => {
      const mappedData = { externalId: 1, fullName: 'Alice' };
      (MapperEngine.execute as jest.Mock).mockReturnValue(mappedData);
      // Simulate no handlers registered for 'db.write.mongodb'
      (eventEmitter.emitAsync as jest.Mock).mockResolvedValue([]); 

      await expect(service.handleDbSyncEvent(mockPayload)).resolves.not.toThrow();
      expect(eventEmitter.emitAsync).toHaveBeenCalled();
    });
  });
});
