# Class: MapperEngine

Defined in: [universal-data-mapper/src/mapper-engine.ts:5](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/universal-data-mapper/src/mapper-engine.ts#L5)

## Constructors

### Constructor

> **new MapperEngine**(): `MapperEngine`

#### Returns

`MapperEngine`

## Methods

### execute()

> `static` **execute**\<`TInput`, `TOutput`\>(`sourceDb`, `targetDb`, `entity`, `sourcePayload`): `TOutput`

Defined in: [universal-data-mapper/src/mapper-engine.ts:21](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/universal-data-mapper/src/mapper-engine.ts#L21)

Executes the transformation of the input data (e.g., SQL join result or standard object)
into an intermediate JSON structure based on the registered mapping schema.

#### Type Parameters

##### TInput

`TInput` = `any`

The type of the source data payload.

##### TOutput

`TOutput` = `any`

The type of the resulting mapped data (defaults to any).

#### Parameters

##### sourceDb

`string`

The origin database identifier (e.g., 'mysql', 'postgres').

##### targetDb

`string`

The destination database identifier (e.g., 'mongodb', 'dynamodb').

##### entity

`string`

The name of the entity being mapped.

##### sourcePayload

`TInput`

The original data payload to be transformed.

#### Returns

`TOutput`

The transformed payload according to the mapping schema, or the original payload if no schema is found.
