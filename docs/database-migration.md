# Database Migration

The database migration process is handled by the CLI application included in this project.
It is used in both the local environment as a command-line application, and on lambda where we expose its own functions that can be called on-demand.

## How to create a migration

First of all, we use TypeORM in background to run the migration process. It means that to create a migration file you should follow the
TypeORM documentation available [here](https://typeorm.io/#/migrations).

However, since we handle different databases with different connections, we do not have a single folder were to put these migrations file.
Therefore, once you have created the file, you should put it in one of the db libraries that you can find in the following path:

`libs/boxedout-libs/db-<yourdb>/src/database/migrations`

The migration file should have this structure:

`<timestamp>-<tableNameOrContext>.ts`

And the content should look like:

```Ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class <tableNameOrContext><timestamp> implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
      [your up queries here]
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      [your down queries here]
  }
}
```

**IMPORTANT**: Once you have created the file, it must be imported inside the `index.ts` file of its own migration folder. This in order to make sure that it's compiled together
with the CLI application files. if the index.ts doesn't exist yet, it must be created and imported inside the `/config/database.ts` file of the relative module.

### Creation of PR and docker image

Once created your migration files you need to open a PR. After the review is approved, the PR will be merged and the package.json version will be upgraded to generate a new CLI docker image automatically.
This CLI image can be used then to run operations locally as well as on AWS/K8S environments.

## How to run migrations

Normally migrations are pre-applied on our generated mysql images and the system is also executed automatically when you run `npm run start` with the `all` project set-up.

However, you still need to run them manually in other occations.

### Locally

To run migrations locally, you just need to run the following command inside the docker container:

```Bash
npm run typeorm:migrate
```

Or if you are outside the docker container:

```Bash
npm run docker:migrate
```

This command will execute all the pending migrations in your databases.
You can use the `--migration` parameter in order to pass a JSON string to selectively run your migrations (see the following paragraph)

### On Kubernetes

Under Kubernetes you need to configure a job to run the CLI automatically when needed. It's a combination of `initContainers` and `jobs`. An example is [available here](https://github.com/boxedout/k8s-configs/blob/master/prod/internaltools/manage-panel.yaml).
The job should point to the latest CLI version (normally this should be done automatically by the pipeline).

If everything is set up properly you can create a configMap to reuse within the `CLI_MIGRATION_PAYLOAD` environment variable of the CLI container.

Here you have an example:

```
        configMap:
          enabled: true
          files:
            - nameSuffix: cli-config
              data:
                migrate.json: |
                  {
                    "boxedoutAdmin": [
                      "adminMetadata1646045181533"
                    ],
                    "boxedout": [
                      "UserAddress1647337505358"
                    ]
                  }
```

The value of the `migrate.json` follows this structure:

```Json
{
  "<dataBaseName1>" : [
    "<migrationClassName1>",
    "<migrationClassName2>",
    "<...>"
  ],
  "<dataBaseName2>" : [
    "<migrationClassName1>",
    "<migrationClassName2>",
    "<...>"
  ],
}
```

Once you have added to your configMap all the migrations you need you have to change the name of the job with a dynamic suffix.
It's the only way to trigger a new job in argoCd.

For instance: `exec-cli-prep-2022-04-08-07-37-22` (we use this date format)

You also have to change the parameter inside the `initContainers` section to match the name of the job. E.g:

`kubectl wait job --for=condition=complete manage-panel-exec-cli-prep-2022-04-08-07-37-22` (note the prefix of the project is always needed, in this case `manage-panel`)

So in order:

1. Make sure you have the right CLI image version and add your migrations to the configMap
2. Change the name of the job with a dynamic suffix
3. Change the command parameter of the initcontainer to match the new job name
4. Commit & push your changes and ArgoCD will run

## Deprecated methods

Before having the CLI on k8s, the procedure to execute the migrations was done by lambda functions.
This method will be deprecated soon though.

### On lambda (Deprecated)

Normally, on our **lambda development environment**, the migrations are executed automatically by the pipeline once the application is deployed.

However, in **production** you need to manually and selectively run migrations by following this steps:

1. Go into the AWS Account -> Lambda -> Functions and search for `boxedout-core-cli-[env]-migrate` function (on production the [env] is `prod`)
2. Scroll down to the `Test` section and write inside the `event document box` a JSON that uses the following structure:

```
{
  "<dataBaseName1>" : [
    "<migrationClassName1>",
    "<migrationClassName2>,
    ...
  ],
  "<dataBaseName2>" : [
    "<migrationClassName1>",
    "<migrationClassName2>,
    ...
  ],
}
```

Once selected all the migrations you want to run, push the "Test" button and wait for the lambda response

### Creation and support of a new database schemas (Deprecated)

The creation of a new schema, as well as the implementation of a new module that supports a previously existing schema,
needs certain permissions to be applied on newly created schemas.
However, our migration system can't "GRANT" privileges in production, its own current permissions are the following:

```sql
GRANT CREATE, CREATE VIEW, ALTER, INDEX ON *.* TO 'db_migrations'@'172.31.%';
```

Therefore, once created a new schema you have to ask db managers to run this query:

```sql
GRANT SHOW VIEW, INSERT, UPDATE, DELETE, SELECT `name_of_the_database`.* TO 'core_api'@'172.31.%';
GRANT SHOW VIEW, INSERT, UPDATE, DELETE, SELECT, DROP, CREATE, CREATE VIEW, ALTER, INDEX ON `name_of_the_database`.* TO 'db_migrations'@'172.31.%';
```

In order to operate on those tables. Also, you need to update the file inside the `/libs/boxedout-libs/db-boxedoutSys/src/database/permissions.sql`

**NOTE:** the user used by the migration system doesn't have `DROP` permissions in production,
hence **dropping a table is always a manual process in that environment**
