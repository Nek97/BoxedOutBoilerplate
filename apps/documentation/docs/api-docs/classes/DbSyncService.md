# Class: DbSyncService

Defined in: [db-sync.service.ts:14](https://github.com/Nek97/BoxedOutBoilerplate/blob/3cd56d7bcdc7b7b314f57d0d81485573635cbf3e/libs/boxedout-libs/modern-infra/src/db-sync.service.ts#L14)

## Constructors

### Constructor

> **new DbSyncService**(): `DbSyncService`

#### Returns

`DbSyncService`

## Methods

### handleDbSyncEvent()

> **handleDbSyncEvent**\<`TInput`\>(`payload`): `Promise`\<`void`\>

Defined in: [db-sync.service.ts:25](https://github.com/Nek97/BoxedOutBoilerplate/blob/3cd56d7bcdc7b7b314f57d0d81485573635cbf3e/libs/boxedout-libs/modern-infra/src/db-sync.service.ts#L25)

Listens to all sync events starting with 'db.sync.'.
Example: emitter.emit('db.sync.insert', payload)

#### Type Parameters

##### TInput

`TInput` = `any`

The expected data type of the payload.

#### Parameters

##### payload

[`DbSyncPayload`](../interfaces/DbSyncPayload.md)\<`TInput`\>

The payload containing the source and target sync details.

#### Returns

`Promise`\<`void`\>
