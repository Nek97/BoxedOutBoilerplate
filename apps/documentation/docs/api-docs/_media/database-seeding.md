# Database Seeding

### Entity Factory creation

The first thing you need, is to create an Entity Factory. For this, we use [faker](https://github.com/marak/Faker.js/) to generate random data.

We need to handwrite all the properties of the entity and assign a random value through faker, or, if we are in production, the field may be empty. Take a look at [`/libs/boxedout-libs/db-boxedoutAdmin/src/factories/asset-static.factory.ts`](https://github.com/boxedout/boxed-out-boilerplate/blob/dev/libs/boxedout-libs/db-boxedoutAdmin/src/factories/asset-static.factory.ts) to see how this is done.
All the factories needs to be added into the FactoryList and also exported within the index of the factories folder.

You can use it in many ways, the most simple way is using `promiseMap` from our library. So each time the seeder is run it will create different entities in parallel.

Example:

```typescript
await promiseMap(fixedUserData.users, async (entry) => {
  await factory(Wallet)().create({
    guid: entry.guid,
  });
});
```

It might also be possible that we need to create entities based on fixed data, that we need to generate these entities only in certain cases or that we need to create the entities based on other entities (a fill is related to an order, it would not make sense to create random fills without basing them on the orders etc.).

In these cases we can create custom logic to implement this, take a look at [`/libs/boxedout-libs/db-boxedoutAdmin/src/database/seeds/create-asset.ts`](../classes/CreateAsset.html#source) to see how the more advanced logic is applied. The next chapter will explain how to use the fixedUserData to dynamically create linked data. Sometimes we might have fixed data which is in no way related to the user (allowedAddressbookDomains for example), in which case we can create a static `fixed-allowed-domains.ts` file, which contains all necessary data.

In the seeder we simply loop over these fixed domains to create them. This only makes sense for "static" data, in this case we have around 48 entries of allowed domains. If this resource can be extended upon dynamically, we should use the factory instead.

### Using the seeder

Also the seeds needs to be added inside the SeedList and exported by the index. Then the seeder should be imported inside the SeedList in the file [Database Connection configuration](./database-connection-setup.md), this is done in `/libs/<DB_LIBRARY>/src/config/database.ts`.

There is another import that we need to make there, the factory import, for that i suggest to import all the db index file, in this way we can import by default all the factories

```
import * as DB_LIBRARY from '../';
```

this way we make sure that `define(<entityName>, <entityNameFactory>)` call will be executed, so the factory will be available for the Seeder.

After you connect the new Seeder to the database, you will need to re-generate your local data.

```
npm run typeorm:reseed
```

### Usage of the seeder-helper

#### How do seedOptions work

We defined a git tracked `seedOptions.json` in `/conf/dist/seedOptions_Prototype.json`. This JSON file has values which are comparable to how production would look. For local development we should copy this file over to `/conf/seedOptions.json`, this will be git ignored and your personal config. The values in this file might result in long seeding times, so if you need faster speed, adjust the values to your own preference.
We will always default to `/conf/seedOptions.json` if it exists, if it does not exist, the default values in `seeder-helper.ts` `seedingObject` will be used.

#### The actual helper itself

We created a new helper file which is intended to create all "related" data before the seeder is ran. The seeder works from the context of an fixed user. The fixed user object might have many properties which are not directly contained in the `User` entity, but are indirectly linked (mostly through userId) to other tables. We can then use this fixed user list in all `create-<resource>.ts` files (which are related to the user).
There are a couple of ways we can utilise this helper:

- If the property needed for seeding is already in the fixed user object (check `FixedUserType` for the definition), we can simply import the `fixedUserData` in our seeder file and loop over it to create our entities. This is only in the case where we have 1-1 relations (an user has max 1 of resource, take a look at `create-user-dynamic.ts`).
- If the property needed is not in the object, we can add it to the `FixedUserType`. We will also have to create a testingEntry for it (take a look at the `testingEntry` and add to it). Finally we need to make sure this property is also filled for our roles and dynamically created data. Add to the `getFixedRoles` function and the `createFixedUserData` function. Finally utilise the fixedUserData in the seeder.
- If we do not have a simple 1-1 relation, we need to create the amount of relations in the `seedingObject` (as well as the `seedOptions.json` if used). The naming format for this is `rel<MainResource>_<NestedResource>`, most will be nested into User, resulting in `relUser_<NestedResource>`. Now we have 2 options: Either use the seedingObject directly in the seeder to create multiple entries per user (when the nested resource has no shared property other than userId, take a look at `create-log-action.ts` for an example). Or fill a list beforehand in the `FixedUserType` which can then be looped over in the seeder (in the case of shared properties, take a look at `create-asset-static.ts` to see how `fixedUserData.assetKeys` is looped over). We should define this relation both in the `seeder-helper` seedingObject as well as our `seedOptions` json file. This is because we verify passed relations from either the seedOptions or a lambda against the relations defined in the seedingObject in the original file.

**NOTE:** When we are talking about properties here, we only mean properties which are shared between resources, other properties can still be created through the factory, since they do not need to match anything.

One exception to this rule would be when you need to set something for a testingEntry, examples of this are the optional fields of `FixedUserType`: `password`, `role`, `phone` and `ip`. These will not be filled for pure dynamic data (since the factory can do this), but the testingEntry or role entries need these specific values.

</br></br>
