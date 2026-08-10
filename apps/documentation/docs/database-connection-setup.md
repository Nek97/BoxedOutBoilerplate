# Database Connection Setup

## Create new database connections

To setup a new database connection, you need to do some extra configuration to create the connection.

1. If the directory does not exist yet, and you're the first to initialize this [Database Module](./application-and-library-creation.md). Create a `database.ts` inside a new `config` directory in the module.

```markdown
./ # root
├── .../
└── libs/
| ├── boxedout-libs
| | ├── db-hello-world
| | │   └── src
| | │   | ├── config
| | │   | | ├── database.ts
```

2. Create a function that exports the configuration for your TypeORM database connection. This function should call the generic `buildDbConfigObject` that returns all the information required to create the connection. You can see more of this in the [Database Connection Configuration](./knowledge-base.md).

3. You need to add the name of the connection to the `DBNames` enum in `/boxedout-libs/shared/src/db-default.conf.ts`. The value should **match exactly** the name of the database you will connect to.

4. Then you will need to intialize your connection in the application that will use it. Add the new TypeOrm connection created on step to `apps/\<APPLICATION>/src/config/database.ts.`. Add the database name to `selConnections` and the configuration call to `dbConf`.

This is application specific, so you will need to do this on each application that requires the Database connection.

5. After this is completed, you can use the connection to any module with databases calls. Generally, this is done on module files, like `/libs/\<LIBRARY>/src/\<MODULE>.module.ts`.

6. In order to execute tests related to the connection in the CLI tests run, add

```
    "boxedout-libs/db-\<connectionName>": {
      "type": "library",
      "root": "libs/boxedout-libs/db-\<connectionName>",
      "sourceRoot": "libs/boxedout-libs/db-\<connectionName>/src",
      "compilerOptions": {
        "tsConfigPath": "libs/boxedout-libs/db-\<connectionName>/tsconfig.json"
      }
    },
```

to `nest.cli.json`

<br /><br />

## Setting Up Database replicas

You can use multiple replicas for querying the database by setting the `MYSQL_TOTAL_REPLICATION_NODES` environment variable with the number of reading replicas you would like to connect. You also need to set the env variables below:

- `MYSQL_REPLICA_HOST_{{X}}`

- `MYSQL_REPLICA_PORT_{{X}}` (optional, default value 3306)

- `MYSQL_REPLICA_USERNAME_{{X}}`

- `MYSQL_REPLICA_PASSWORD_{{X}}`

Where `{{X}}` is a number between 1 and `MYSQL_TOTAL_REPLICATION_NODES`.

The development environment will provide 1 replica by default.

**WARNING**: Before you execute the next steps if you were using the application before it would be recommended to destroy the volumes you have been working on by running `docker-compose down -v`.

The MySQL container is already running as a master database by default in the replication process.

Make sure you copy the env vars related to database replication in `conf/dist/.env.docker` and paste it to your local `.env` file. The boxed-out-boilerplate container needs those env vars to connect to the replicas.

**All steps below need to be executed in your local desktop terminal (not inside the devcontainer!).**

1. Unfortunately, we can't start the dev stack with the configuration in the `.devcontainer` folder, for now, so you will need to run the docker-compose profile command on your own if you need to use the replica database. In your machine command line execute the command below:

   ```bash
      docker-compose --profile=mysql-replica up -d
   ```

2. Create a replication user:

   ```bash
   docker-compose exec mysql \
       'mysql' -uroot -p$MYSQL_ROOT_PASSWORD -vvv \
       -e "GRANT REPLICATION SLAVE ON *.* TO repl_user@'%' IDENTIFIED BY 'repl_password';"
   ```

   You can find the value for `$MYSQL_ROOT_PASSWORD` in `conf/dist/.env.docker`.

3. Check out the master status:

   ```bash
   docker-compose exec mysql \
       'mysql' -uroot -p$MYSQL_ROOT_PASSWORD -e "SHOW MASTER STATUS;"
   ```

   Take notes from the File and Position values, we will need both to set up the slave in the next step.

4. To set up the slave we need configure which host the master is, as well as the replition user/pwd:

   ```bash
   docker-compose exec mysql-replica \
      'mysql' -uroot -p$MYSQL_ROOT_PASSWORD \
      -e "CHANGE MASTER TO MASTER_HOST='mysql',MASTER_USER='repl_user', MASTER_PASSWORD='repl_password', MASTER_LOG_FILE='{{LOG_FILE_NAME}}', MASTER_LOG_POS={{FILE_LOG_POS}};"
   ```

   The values for `{{LOG_FILE_NAME}}` and `{FILE_LOG_POS}}` are the File and Position respectively values from the previous step.

5. Let's start the slave and check out its status:

   ```bash
   docker-compose exec mysql-replica \
      'mysql' -uroot -p$MYSQL_ROOT_PASSWORD \
      -e "START SLAVE;"
   ```

   ```bash
      docker-compose exec mysql-replica \
         'mysql' -uroot -p$MYSQL_ROOT_PASSWORD \
         -e "SHOW SLAVE STATUS;"
   ```

   If everything was set up correctly you would see "Waiting for master to send event" message in the `Slave_IO_State` column.

6. Now you can execute in your boxed-out-boilerplate container the setup database setup commands `npm run typeorm:initdb && npm run typeorm:reseed` and start the application normally `npm run start:dev`.
