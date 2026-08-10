# Application and Library Creation

The [architecture guide](./application-architecture.md) describe in high level the modules and applications you can find in this project within the `apps` and `libs` directories. This guide instead will introduce the steps necessary to create new modules.

Before going ahead though is very important to have the following knowledge first:

- [NestJS](./nestjs.md)
- [NestJS-YALC/Ag-Grid API Creation](https://www.drassil.org/nestjs-yalc/api-creation.html)

## Creating new libraries

You will find all reusable modules inside `/libs`. Libraries can be classified in 3 different sub directories:

- boxedout
- boxedout-libs
- common

To create a new CRUD module we suggest to copy the folder `libs/boxedout/skeleton-boxedout-module` that contains a "ready to be used" template
that you should adjust accordingly.

Once you've copied the skeleton template and adjusted its sources accordingly to your need, you have to integrate your new module inside the project by
following these steps:

### 1. Add your module to the nest-cli.json, for example:

```json
    "boxedout/my-new-module": {
        "type": "library",
        "root": "libs/boxedout/my-new-module",
        "sourceRoot": "libs/boxedout/my-new-module/src",
        "compilerOptions": {
        "tsConfigPath": "libs/boxedout/my-new-module/tsconfig.json"
      }
    },
```

### 2. Edit the entries created in the `tsconfig.json` file in the root directory. This is important to make other modules import your module with the given module name instead of the full path to the file


```json
  "@boxedout/my-new-module": [
    "libs/boxedout/my-new-module/src"
  ],
  "@boxedout/my-new-module/*": [
    "libs/boxedout/my-new-module/src/*"
  ],
```

### 3. Set your module in the dependencies of the `jest.config.ts` into the projects that are using the new module:

```javascript
    {
      name: 'boxedout/my-new-module',
      path: nestProjects['boxedout/my-new-module'].root,
    },
```

This is needed to avoid that the module is tested even when a project doesn't use it.

### 4. Add your module inside your app and your new entities within the entity list of your database configurations.

Congrats. You just created your first module 👏

Now anyone can reuse your module in any other package. 🥂

NOTES:

- The skeleton module contains also the entities, normally we should put the entities within the persistance layer (libs/boxedout-libs) in this way they can exported as a package and
  reused by other projects.
- The skeleton module is injected in this project with TypeORM synchronization enabled that allows us to not use any migration to create the table. However, this is only for demo.
  It's strongly suggested to create [database migrations](./database-migration.md) to create a table from the scratch.

# New Database module

If your module also needs connection to the Database, you need to do some extra configuration to [Setup a Database Connection](./database-connection-setup.md).


# Creating new Apps

TBD
