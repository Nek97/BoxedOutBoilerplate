# Class: DbSyncService

Defined in: [modern-infra/src/db-sync.service.ts:14](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/modern-infra/src/db-sync.service.ts#L14)

## Constructors

### Constructor

> **new DbSyncService**(`eventEmitter`): `DbSyncService`

Defined in: [modern-infra/src/db-sync.service.ts:17](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/modern-infra/src/db-sync.service.ts#L17)

#### Parameters

##### eventEmitter

`EventEmitter2`

#### Returns

`DbSyncService`

## Methods

### handleDbSyncEvent()

> **handleDbSyncEvent**\<`TInput`\>(`payload`): `Promise`\<`void`\>

Defined in: [modern-infra/src/db-sync.service.ts:26](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/modern-infra/src/db-sync.service.ts#L26)

Listens to all sync events starting with 'db.sync.'.
Example: emitter.emit('db.sync.insert', payload)

#### Type Parameters

##### TInput

`TInput` = `Record`\<`string`, `unknown`\>

#### Parameters

##### payload

[`DbSyncPayload`](../interfaces/DbSyncPayload.md)\<`TInput`\>

The payload containing the source and target sync details.

#### Returns

`Promise`\<`void`\>
