# Interface: MappingSchema

Defined in: [universal-data-mapper/src/mapping-schema.interface.ts:4](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/universal-data-mapper/src/mapping-schema.interface.ts#L4)

Rappresenta la definizione di trasformazione tra un DB di origine e uno di destinazione.

## Properties

### defaults?

> `optional` **defaults?**: `Record`\<`string`, `any`\>

Defined in: [universal-data-mapper/src/mapping-schema.interface.ts:19](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/universal-data-mapper/src/mapping-schema.interface.ts#L19)

(Opzionale) Permette di definire dei valori costanti/di default che 
vengono applicati all'oggetto di destinazione a prescindere dal source.

***

### fields

> **fields**: `Record`\<`string`, `string` \| ((`sourcePayload`) => `any`)\>

Defined in: [universal-data-mapper/src/mapping-schema.interface.ts:13](https://github.com/Nek97/BoxedOutBoilerplate/blob/2e471d527ca1fb9b2200a13b2ce9ed0ee57402f9/libs/boxedout-libs/universal-data-mapper/src/mapping-schema.interface.ts#L13)

Mappa le chiavi dell'oggetto di destinazione (es. MongoDB/JSON)
ai valori estratti dall'oggetto sorgente (SQL Join).

Il valore può essere:
- Una stringa che rappresenta un path Lodash (es. `user.profile.age`)
- Una funzione custom per trasformazioni complesse (es. somme, date)
