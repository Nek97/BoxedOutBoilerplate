# Knowledge Base

General information and tips for the techniques, tools, and solutions used in this project.

## Github discussion board

On our discussion board you can find tips and guides that are not (yet) in this documentation: [DISCUSSION BOARD](https://github.com/boxedout/boxed-out-boilerplate/discussions)

If you have any questions or you want to create a guide that does not necessarily have to be in this documentation, please use the discussion board.

## TypeORM

### Database Connection Configuration

Implementing a new connection to the database requires the developer to create `database.ts` a file in `/config` . A function with the name of the database module needs to return a valid TypeORM config object.

We created a base function to make this process smoother with `buildDbConfigObject`function found in `@nestjs-yalc/database/db-config-object.helper`.

### Usage of QueryBuilders

The production environment uses multiple MySQL instances for improving reading speed and off-loading the main instance from reading queries.

With the introduction of multiples replicas, [TypeORM's QueryBuilder](https://typeorm.io/#/select-query-builder) now requires the developer to explicitly set which database's replication mode (slave or master) should be applied to its operations, a QueryRunner is required in this case, TypeORM will also require the developer to release the created query runner as soon he/she has finished using the associated QueryBuilder.

It's recommended to use the `applyOperationToQueryBuilder` function found in `@nestjs-yalc/database/src/db-config-object.helper.ts` . It will guarantee that your QueryBuilder targets the correct replication mode passed whenever the replication is used in the application, and it will release the created QueryRunner in this process.

You can find more information about the TypeORM replication config [here](https://typeorm.io/#/multiple-connections/replication).

## common/utils

### returnValue - `@nestjs-yalc/utils/src/returnValue.ts`

You may use this function to help you out achieving 100% coverage in resolvers' methods or TypeORM entities. This function is only valid if the value returned exists in runtime (classes, functions, strings, etc).
