# Testing

## Unit Tests and Coverage

We decided to achieve 100% Unit Test Coverage for all files which relate to the **core-api** (with exception of test/config files, coverage on end-to-end tests wouldn't make sense).

We have created a command to run the coverage on all files, which is `npm run test:cov`. This generates a list depicting whether we have walked all paths of if statements and whether we covered all files. When it is not completely evident what is not covered, we can use the locally hosted jest coverage report to check what is missing.

When using `npm run test:cov` you can also specify a path in order to reduce the time needed to run your tests, especially when you're working on a specific part of the application.
Please, always use it when you're working on a specific module since we have to guarantee the 100% coverage of a module/library without inheriting
this by other tests.

This can be served through running `npm run test:cov:serve`, after which you should be able to open this link [http://127.0.0.1:8080/](http://127.0.0.1:8080/) (the port will be automatically open & forwarded by the VSCode devcontainer), select your project and click on any paths which are not fully green/100% to check what should be added to our tests. Every time you run the coverage command, you have to reload the browser tab in order to see the changes.

**NOTE:** if you run the `npm run test:cov` with a specific path, then you can access the related folder available inside the index page provided by the `test:cov:serve` command.
This folder will contain the coverage collected everytime you run the `test:cov` command with the path specified.

When writing tests, you should never test functions which are not part of that specific collection, this means **you should mock all external libraries**. Calling the service while testing the resolver is fine, since they belong to the same collection. However a repository returning the resource in the service should be mocked.
Also make sure you always test something that makes sense. For example, if the resource that is returned is actually of the correct instance type. Simply checking whether the service/resolver is defined, this may give coverage, but will not result in good tests.

### Debug your unit tests

Before starting, place the breakpoints where you want to debug your code (Read the [VSCode documentation](https://code.visualstudio.com/docs/editor/debugging))

When using the VSCode devcontainer, you will have the extension `orta.vscode-jest` automatically installed.
This repo is configured to support that extension allowing you to click on the "Debug" label which will appear on top of each test function.
It will run our `npm run test:debug` command starting the node inspector tool together with jest.
An output like the following will be shown within the terminal:

```
> boxedout-core-api@3.2.2 test:debug
> node --inspect-brk=0.0.0.0:9229 'node_modules/.bin/jest' --logHeapUsage --runInBand "--watchAll=false" "--testNamePattern" "Check convertNumberFilter with combined invalid operator Filter" "--runTestsByPath" "/opt/application/libs/common/ag-grid/src/__tests__/ag-grid-args.decorator.spec.ts"

Debugger listening on ws://0.0.0.0:9229/1935e75c-9895-45d7-81d9-c9cc30041bd9
For help, see: https://nodejs.org/en/docs/inspector
```

**NOTE:** The port 9229 must be available

Once clicked the Debug label and defined the breakpoints, you need to run the "Attach" command in the Debug section of VSCode in order to let VSCode to detect the node inspector and
to run the debugger.

![Attach Button](./assets/debug-attach-btn.png)

### How to run the debugger with the command line

If you want to run the debugger in your terminal, you can use the following command:

`npm run test:debug -- [path of the tests] -t [spec name pattern]

where the `[path of the tests]` and the `-t [spec name pattern]` are optional, but useful to avoid debugging the entire application.
Considering that the `test:debug` uses the `--runInBand` jest option, it will take a lot of time to run every single test, that's why you should
never run this command without those parameters.

### Using Factories in Unit Tests

As part of our [Database Seeding](./database-seeding.md) process we have to build [Entity Factories](https://github.com/w3tecch/typeorm-seeding#-using-entity-factory). These factories allow us to create dummy data for our local environments, by generating entities with randomized data based on each one of the fields.

But Factories are also useful when building Unit Tests, although you're free to create entities from scratch, by creating a new instance of any entity you need in the test. You can also use factories to **make** an instance of a specific entity:

```typescript
import { AwesomeEntity } from '@boxedout-libs/db-boxedout/entities/awesome.entity';
import { EntityFactory } from 'typeorm-seeding/dist/entity-factory';
import { awesomeFactory } from '@boxedout-libs/db-boxedout/awesome.factory';

const factory: EntityFactory<any, any> = new EntityFactory(
  'AwesomeEntity',
  AwesomeEntity,
  awesomeFactory,
);

const awesomeInstance: AwesomeEntity = await factory.make();
```

In the example above, the instance generated by the factory will have all fields set with generated data. Although in some cases you need to set particular scenarios in which entities should have specific hardcoded values. For those cases you can also pass any field you want to hardcode for that entity.

```typescript
const awesomeInstance: AwesomeEntity = await factory.make({
  id: '1234',
  description: 'Awesome stuff!',
});
```

Additionally if needed, you make many instances at the same time, using [typeorm-seeding makeMany](https://github.com/w3tecch/typeorm-seeding#make--makemany):

```typescript
const users: User[] = await factory.makeMany(5, { field1: 'overriden_value' });
```

## End-to-end (Feature) Tests

### How does it work

We have build a generator and tester for end-to-end testing. This should prevent us from writing tests for highly comparable endpoints (get a resource with a parameter). To make this work we should maintain a couple of important variables mentioned in the last chapter.

The basics are as follows. We use the graphql introspection to get all fields of a resource. We bind endpoints to these resource by removing the prefix, and everything after `Grid`. For this reason it is very import you keep to the naming conventions:

```
<namespace>_get<ResourceName>Grid<CanBeAnythingYouLike>
```

in this example the `<ResourceName>` is what should be exactly equal to the class specified in the entity file. Everything after grid can be used to specify specific parameters for this endpoint, like is the case with `ManageUser_getUserLogGridByUserId`.

### How to run

We can run the `auto-tests.e2e-spec.ts` test with or without creating new queries. When a new endpoint has just been added we should always generate a new `queries.ts`. This is done through running `npm run test:e2e:autoupdate`, while testing without creating a new `queries.ts` is done through the regular `npm run test:e2e`. When a new `queries.ts` has been generated we should always run the test again to actually test these new queries (on the first iteration they are only created, such that we always test the previous queries state).
When you encounter problems, copy the generated query from the `queries.ts` file and run it manually through the [graphql playground](http://localhost:60000/graphql/).

### Important variables

The most important variable is the `queryMap`. This map should have all queries as keys and implements options through three important features:

- It has a role that should always be the same as the one specified in the resource resolver.
- It can specify multiple arguments through an object. The key should always be the name of the field, which is used as an argument for the query. The value should be equal to an existing value in our database (i.e phone numbers, IP addresses, etc). You can use the `testingEntry.guid` constant from the seeder helper to query data linked to that user identifier, the seeder will make sure that the relationships exist behind the scenes. Assure this value is created statically through the seeder. For Grid queries with required parameters, we must specify all required parameters in the args object. For Grid queries without required parameters, no args should be specified, the topmost field is automatically used for sorting. For non grid queries (singular GET), we must also specify the parameter in the args object.
- It uses an array of objects per query. This is so you can define multiple tests for a single endpoint, for example when we can request an endpoint through two different parameters (opposed to using two at the same time, which is handled by adding extra keys and values to the `args` object). An example of this is the `ManageUser_getUserLogGridAuditUser` query. The queries written to `queries.ts` will automatically be postfixed with an index to reflect the index in this array.

```typescript
const queryMap: IQueryMap = {
  ManageUser_getUserQuestionnaireGrid: [{ role: RoleEnum.AGENT }],
  ManageUser_getUserLogGridByUserId: [
    { role: RoleEnum.AGENT, args: { userId: 'testingEntry' } },
  ],
  ManageUser_getUserLogGridAuditUser: [
    { role: RoleEnum.AUDIT_USER, args: { ip: '127.0.0.0' } },
    { role: RoleEnum.AUDIT_USER, args: { device: 'testingEntry' } },
  ],
};
```

Below are the fields which are skipped. Fields in this case can mean two things:

- A field of a resource, `AdminLog` is an example of this. Since `AdminLog` is a dynamically loaded resource through nesting, we do not need to end-to-end test it, since the resource unnested is tested on it's own. Do not confuse this with skipping the resource AdminLog, this will only skip it when it occurs as field of another resource.
- A field of the object `Queries` of the introspection, in other words the query in it's entirety. This can be used when dedicated end-to-end tests have been written which are too complicated for the automated test. `_service` is an example of this, since they use another format, we skip them entirely in the automated tests.

```typescript
const fieldsToSkip = ['_service', 'AdminLog', 'UserPhone'];
```

The following two variables should not have to be edited. When we add other retrieval possibilities aside from Grid or when we add other CRUD operations we can extend these list.

```typescript
const splitInputs: string[] = ['get', 'create', 'delete', 'update'];
const postfixRemoves: string[] = ['Grid', 'Edges'];
```

<br/>

## Tips

### envTestHelper `@nestjs-yalc/jest/src/env.helper.ts`

You may have to set environment variables to test certain functionalities of your code, in this case, you can use this function to improve the reliability and readability of your tests.
There are three steps to use this function appropriately:

- Execute the function in the scope your tests can access. You may provide already an object with the environment variables you would like to set.
- Call the `build` the method with any environment variable you would like to set inside each test.
- Call `reset` in a `afterEach`
