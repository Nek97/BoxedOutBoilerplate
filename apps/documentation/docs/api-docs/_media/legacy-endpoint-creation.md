# Endpoint Creation

To create an endpoint for GraphQL we need to follow a few necessary steps.

## Create the entity

The first step is the creation of the entity. When we create an entity we need to manage it for typeorm as well as for graphql.

We can specify the original name of the field using the `@Column` decorator and the exposed name with the `@Field` decorator. If you want to hide a field in the exposed endpoint use the `@HideField` decorator on the respective field.
Take a look at [`/libs/boxedout-libs/db-boxedoutAdmin/src/entities/dto/asset-static.entity.ts`](../classes/MonitorAsset.html#source) to see how this is done.
Follow the next chapter to prevent writing this by hand entirely.

## Create the entity from supplied entity

There is also an easier way to get the entity model, without writing it from hand entirely. We do this through the [typeorm-model-generator](https://www.npmjs.com/package/typeorm-model-generator), to use it you should:

1. import all the databases, nowadays this is handled automatically for you when starting the application.

2. Run the [typeorm-model-generator](https://www.npmjs.com/package/typeorm-model-generator) to extract the entities. This is done by running the following command: `npm run cli -- generate <databaseName>` where `<databaseName>` should be replaced by the name of the database for which entities should be exported, for example `boxedout` or `boxedoutAdmin`, resulting in `npm run cli -- generate boxedoutAdmin`.

**All entity files** will be created in `var/models/<databaseName>/entities`.

3. We should make sure that the generated file name adhers to our [naming conventions](./naming-conventions.md). This means we will have to convert it to a singular format if it is defined plurally in the database, as well as replace the default camelCase to the kebab-case we use for files. Finally we should move the entity file to the correct folder `boxedout-libs/db-<databaseName>/src/entities/` where again `<databaseName>` should be replaced by the name of the database.

4. To refactor the contents of the file to an usable format for NestJS we need to do a couple of things.

   a. First we need to add the `@ObjectType()` decorator on top of the class to assure both typeORM and GraphQL handle this as the same object.

   b. Next we need to find out which properties need to be exposed differently than they are defined:

   - The field `guid` should be exposed as `userId`.
   - For all the columns add the `@Field` decorator to map the original key to a self-defined key.
   - For all the fields we want to hide, we should specify the `@HideField()` decorator.
   - For all the fields which are defined as decimal in the database we should add the [`decimalMiddleware`](https://github.com/boxedout/boxed-out-boilerplate/blob/dev/libs/common/decimal-middleware/src/decimal-middleware.helper.ts) component, to make sure we expose these values as Float instead of as string (so in turn we can apply numeric filtering on these fields). Take a look at [`asset-static.entity.ts`](../classes/MonitorAsset.html#source) field `transferValue` to see how this is done.

   c. Finally we should again make sure that our class adhers to our [naming conventions](./naming-conventions.md), make it a singular version (while you keep `@Entity` like it is, since this guarantees our database format stays the same) and convert to the class name to PascalCase, if this is not already the case.

5. If the connection to that database already exists, you can simply add, and export the entity to the entities array, to the list of entities loaded as part of that connection in the Database Module, on `libs/boxedout-libs/<DB_MODULE>/src/entities/index.ts`.

If you need to create a new database connection, please check the [Database Connection Setup documentation](./database-connection-setup.md).

## Creation of the input/output interface and the type

### The mapper

We must also create a type for our entity. This was we can define a mapper between original database fields and the exposed fields. Take a look at [`/libs/boxedout/manage-monitor/src/dto/asset.type.ts`](../classes/MonitorAssetType.html#source) to see how this is done. Make sure the map contains the same mapped fields as we defined in our entity file originally through the `@Field` decorator.

### Ag Grid

TODO: specify AG grid specific input/output and type.

## Creation of the service

Services work as a middle layer that implement business logic and calls **typeorm** to get the data from the database. You should extend your Service from the `GenericService` class in **@boxedout-libs/shared/generic-service.service**, in that way you already get generic functions to retrieve entity data.

```typescript
@Injectable()
export class ExampleService extends GenericService<ExampleEntity> {
  constructor(
    @InjectRepository(ExampleEntity, 'boxedoutConnection')
    repository: Repository<ExampleEntity>,
  ) {
    super(repository);
  }
}
```

Alternatively, you can also utilize the `GenericServiceFactory` [Service Provider Factory](https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory), that can be used to create a `GenericService` instance that retrieves data instead of creating a custom Service file.

## Creation of the resolver

We've created the logic of the queries, now we need to expose them to the graphql playground and to the client using a resolver. On the resolver we implement all of our Guards, interceptors, etc. (in [the lifecycle](./application-lifecycle.md) we can see the user resolver returning on every aspect). The resolver itself should not implement any logic on the resource, since this is handled by the service. Therefore we simply implement all necessary decorators and call the respective service. When we have a dynamic field (another entity loaded through this entity), we also need to add a dataLoader. Create a private `dataloader` in the class with the help of the [generic loader](https://github.com/boxedout/boxed-out-boilerplate/blob/dev/libs/common/data-loader/src/data-loader.helper.ts) and the chapter later in this document: "Nesting a resource", also create a private `fields`, which we use to pass the selected fields to the loader. Finally create a function which uses the `@ResolveField` decorator to overwrite the resolving of a field, where you call the `loader.load()` function on the requested entity. Take a look at [`/libs/boxedout/manage-monitor/src/asset.resolver.ts`](../classes/MonitorAssetResolver.html#source) to see how this is done.

## Adding the resolver and service to our module

Now we need to go back to our [`libs/boxedout/manage-monitor/monitor.module.ts`](../modules/MonitorModule.html#source) to add the service and resolver to our providers through dependency injection. Simply add your newly created service and resolver to the providers array, or create a new providers array in the case of a new module.

Now, if we go to the [Graphql playground](http://localhost:60000/graphql/) we can find and try out our queries (if you have any doubt check [Querying Graphql](./querying-graphql.md) page for an help).

## Nesting a resource

Sometimes it occurs that we need to nest a specific resource into another resource. Mostly this happens when when the nested resource is requested in the context of the parent resource. For example when getting the logs belonging to an user, we need to nest the log resource into the user resource.
We need to do a couple of things to implement this:

- Create the dataloader next to the service and resolver. Name the dataloader `<resource>-dataloader.ts`, where `<resource>` is the same as it is for service and resolver. The dataloader should extend from our default DataLoader and pass the correct entity to it. Within the constructor we call the parent constructor and pass the correct service funtion as well as the name of the field on which we are nesting (shared column between both resources, mostly guid).

```typescript
@Injectable()
export class AdminLogDL extends GQLDataLoader<AdminLog> {
  constructor(private adminLogService: AdminLogService) {
    super(
      (findManyOptions: AgGridFindManyOptions) =>
        this.adminLogService.getEntityListAgGrid(findManyOptions),
      'guid',
    );
  }
}
```

- Extend the service to be able to return both with count and without count. Since we would want the resource directly to be returned with count, but a nested resource without count. Refactor the old service `getList` code to the same format as is shown in [`admin-log.service.ts`](../injectables/AdminLogService.html#source). Add the withCount parameter and the three different function calls, also make sure to return `repository.getManyAndCountAgGrid(findOptions)` when `withCount` is true, but `repository.getManyAgGrid(findOptions)` when `withCount` is false.

- Add the nested resource dataloader (and if not yet present, also the service and entity) in the module where the parent belongs to. Take a look at the [`user.module.ts`](../modules/ManageUserModule.html#source) to see how this is done.

* Add a `@ResolveField` function to the resolver of the parent, to make sure that the loader is called when requesting the nested field. Begin by placing the dataloader as private in the resolver constructor and then follow the format below, replace guid by the correct shared column if it's named differently than guid. Make sure you replace the key in `loadWithFields({ <KEY>: value })` as well, since it is used to determine the name of the field. Specify the parent type and fieldMap which should be used to translate the fields. You should end up with something like below. Check [`user.resolver.ts`](../classes/UserResolver.html#source) for more examples.

```typescript
@ResolveField(returnType(AdminLogType))
async AdminLog(
  @Parent() user: UserType,
  @GqlFieldsMap(AdminLogFieldMap) fields: (keyof AdminLog)[],
) {
  const { guid } = user;
  return this.adminLogDL.loadWithFields({ guid: guid }, fields);
}
```

## Joining a resource

### Explanation

Sometimes, on top of needing to show a resource related to another resource (like we do with nesting), we also need to be able to apply some kind of filtering to the nested resource. This filtering applies to the parent resource, we will provide an example to make clear what the situation is:

The `UserDynamic` resource needs to show the `UserTag` as well, on top of this, as a user of the manage panel, we want to be able to filter the users by which tags they have assigned to them. However these users should still show all tags which are assigned to them, not solely the tag on which we want to filter. This means we need to be able to filter the `UserDynamic`, by the property `tag` belonging to resource `UserTag`, while still showing all `UserTags`.

This kind of filtering is not possible when using nesting. GraphQL will complain that the field UserTag.tag does not exist. Therefore we should implement joining instead.

### Implementation

To implement joining we need to do a couple of things:

1. Define the column in both the parent entity and the child entity, through usage of the `@JoinColumn()`, `@OneToOne()`, `@OneToMany()` and `@ManyToOne()` decorators:

`parent.entity.ts`

```TypeScript
@OneToMany(typeCB, relationCB)
@JoinColumn({ name: 'FIELD_ON_WHICH_WE_JOIN', referencedColumnName: 'FIELD_ON_WHICH_WE_JOIN })
CHILD_RESOURCE_TYPE: CHILD_RESOURCE_TYPE[];
```

replace

- FIELD_ON_WHICH_WE_JOIN by the field which is shared between both resources (usually `'guid'`)
- CHILD_RESOURCE_TYPE by the type of child resource (the one of which we are not editing the `.entity.ts`, e.g. UserTag)
- **_(Make sure to use an array when we specify OneToMany!)_**

`child.entity.ts`

```TypeScript
@ManyToOne(typeCB, relationCB)
@JoinColumn({ name: 'FIELD_ON_WHICH_WE_JOIN', referencedColumnName: 'FIELD_ON_WHICH_WE_JOIN })
PARENT_RESOURCE_TYPE: PARENT_RESOURCE_TYPE;
```

replace

- FIELD_ON_WHICH_WE_JOIN by the field which is shared between both resources (usually `'guid'`)
- PARENT_RESOURCE_TYPE by the type of the parent resource (the one of which we are not editing the `.entity.ts`, e.g. UserDynamic)

Both `child.entity.ts` and `parent.entity.ts`

```TypeScript
export const typeCB = () => OTHER_TYPE;
export const relationCB = (LOWERCASE_OTHER_TYPE: OTHER_TYPE) => LOWERCASE_OTHER_TYPE.OWN_TYPE;
```

replace

- OTHER_TYPE by the type of which we are not editing `.entity.ts` (e.g. UserDynamic)
- LOWERCASE_OTHER_TYPE by an instance of the type (e.g. userDynamic)
- OWN_TYPE by the type of which we are currently editing `.entity.ts` (e.g. UserTag)

2. Implement the relation as findOptions in the appropriate service. Take care: Do we already serve this as nested resource? Remove the @ResolveField from the resolver. Do we still need the old endpoint without joining (aka will frontend ever use this endpoint without applying advanced filtering options)? Then we should create an entirely new endpoint for the joined resource. However, when the endpoint without joining is no longer needed, we can simply rewrite the getEntityList to use the relations (make sure to overwrite the generic service!). We always implement the relation on the `parent.service.ts`.

```TypeScript
const findInput = {
  join: {
    alias: 'LOWERCASE_OWN_TYPE',
    innerJoinAndSelect: { OTHER_TYPE: 'LOWERCASE_OWN_TYPE.OTHER_TYPE' },
  },
};
return withCount
  ? this.monitorAssetRepository.findAndCount(findInput)
  : this.monitorAssetRepository.find(findInput);
```

replace

- LOWERCASE_OWN_TYPE by an instance of the parent type (e.g. userDynamic)
- OTHER_TYPE by the type of the child (e.g. UserTag)
- OWN_TYPE by the type of the parent (e.g. UserDynamic)

findInput can then replace the findOptions (which are applied through `applyWhereToQueryBuilder`) in the `repository.find(AndCount)`. For now we decided to ignore the select in the findOptions, and simply get all fields. We could improve this in the future.

Take a look at `UserDynamic` and `UserTag` (both `.entity.ts` and `.service.ts`) to see how `OneToMany` and `ManyToOne` relations work, and at `User` and `UserDynamic` to see how `OneToOne` relations work.

## Writing tests

Every function should have 100% coverage on unit tests. Use the same filename, but replace the `.ts` with `.spec.ts` and place the file in the appropriate `__tests__` folder. E2E tests should be handled for you through the `auto-tests.e2e-spec.ts` file.

Add the correct role to your newly created query in the object on top of the file. Run the `npm run test:e2e` with the `UPDATE_QUERIES` environment variable set to true to automatically recreate the test queries in `queries.ts` (nowadays we can use `npm run test:e2e:autoupdate` to set the variable automatically).

It is your own responsibility that these newly created queries run with no problems at all as well (run the test again after recreating queries, since previous `queries.ts` iteration is used to check the current implementation). If you need any help with the automated tests (or other tests), please ask one of the other developers.

<br/>
