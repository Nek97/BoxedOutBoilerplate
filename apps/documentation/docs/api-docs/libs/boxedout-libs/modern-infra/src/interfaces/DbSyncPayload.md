# Interface: DbSyncPayload\<T\>

Defined in: [modern-infra/src/db-sync.service.ts:5](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/modern-infra/src/db-sync.service.ts#L5)

## Type Parameters

### T

`T` = `Record`\<`string`, `unknown`\>

## Properties

### action

> **action**: `"insert"` \| `"update"` \| `"delete"`

Defined in: [modern-infra/src/db-sync.service.ts:8](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/modern-infra/src/db-sync.service.ts#L8)

***

### data

> **data**: `T`

Defined in: [modern-infra/src/db-sync.service.ts:10](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/modern-infra/src/db-sync.service.ts#L10)

***

### entityName

> **entityName**: `string`

Defined in: [modern-infra/src/db-sync.service.ts:9](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/modern-infra/src/db-sync.service.ts#L9)

***

### sourceDb

> **sourceDb**: `string`

Defined in: [modern-infra/src/db-sync.service.ts:6](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/modern-infra/src/db-sync.service.ts#L6)

***

### targetDb

> **targetDb**: `string`

Defined in: [modern-infra/src/db-sync.service.ts:7](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/modern-infra/src/db-sync.service.ts#L7)
