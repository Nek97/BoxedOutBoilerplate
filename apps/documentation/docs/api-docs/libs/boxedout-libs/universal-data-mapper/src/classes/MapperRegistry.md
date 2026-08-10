# Class: MapperRegistry

Defined in: [universal-data-mapper/src/mapper-registry.ts:4](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/universal-data-mapper/src/mapper-registry.ts#L4)

## Constructors

### Constructor

> **new MapperRegistry**(): `MapperRegistry`

#### Returns

`MapperRegistry`

## Methods

### getMap()

> `static` **getMap**(`sourceDb`, `targetDb`, `entity`): [`MappingSchema`](../interfaces/MappingSchema.md) \| `undefined`

Defined in: [universal-data-mapper/src/mapper-registry.ts:40](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/universal-data-mapper/src/mapper-registry.ts#L40)

Retrieves a previously registered mapping schema.

#### Parameters

##### sourceDb

`string`

The origin database identifier

##### targetDb

`string`

The destination database identifier

##### entity

`string`

The entity name or collection name

#### Returns

[`MappingSchema`](../interfaces/MappingSchema.md) \| `undefined`

The corresponding MappingSchema or undefined if not found

***

### register()

> `static` **register**(`sourceDb`, `targetDb`, `entity`, `schema`): `void`

Defined in: [universal-data-mapper/src/mapper-registry.ts:26](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/universal-data-mapper/src/mapper-registry.ts#L26)

Registers a new mapping schema for data transformation across different databases.
This is typically called during the bootstrap or module initialization phase.

#### Parameters

##### sourceDb

`string`

The origin database identifier (e.g., 'postgres', 'mysql')

##### targetDb

`string`

The destination database identifier (e.g., 'mongodb', 'dynamodb')

##### entity

`string`

The entity name or collection name

##### schema

[`MappingSchema`](../interfaces/MappingSchema.md)

The mapping rules to transform the entity payload

#### Returns

`void`
