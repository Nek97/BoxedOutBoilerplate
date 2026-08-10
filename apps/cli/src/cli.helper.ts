import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CliModule, ICliOptions } from './cli.module';
import {
  DbOpsService,
  MigrationSelection,
} from '@nestjs-yalc/database/db-ops.service';
import { SeedService } from '@nestjs-yalc/database/seed.service';
import { setSeedingObject } from '@boxedout-libs/shared/seeder-helper';
import { ConfigService } from '@nestjs/config';
import { CLI_CONF_ALIAS, ICliServiceConf } from './config/service';

export const cliAppFactory = async (
  commandName: string,
  options: ICliOptions = {},
) => {
  const { keepDBConnectionAlive = true, project, envPath } = options;
  return NestFactory.createApplicationContext(
    CliModule.forRoot({
      project,
      envPath,
      commandName,
      keepDBConnectionAlive,
    }),
  );
};

export interface IProgramDefOptions {
  project?: string;
  envPath?: string | string[];
  log?: boolean;
  [key: string]: unknown;
}

const closeCli = async (cli: INestApplicationContext) => {
  //await cli.init();
  await cli.close();
  const service = cli.get<DbOpsService>(DbOpsService);
  await service.closeAllConnections();
};

export const programSeedDatabase = async ({
  log,
  reseed,
  project,
  envPath,
  seedingObject = undefined,
}: {
  reseed: boolean;
  seedingObject: { [key: string]: number } | undefined;
} & IProgramDefOptions) => {
  if (!log) {
    process.env.TYPEORM_LOGGING = 'false';
  }

  const app = await cliAppFactory('programSeedDatabase', { project, envPath });

  setSeedingObject(seedingObject);
  const service = app.get<SeedService>(SeedService);

  await service.seedDatabases(reseed);
  await closeCli(app);
};

export interface IProgramMigrateDBOptions extends IProgramDefOptions {
  migrations?: MigrationSelection;
  reseed?: boolean;
}

export const programMigrateDatabase = async ({
  project = undefined,
  envPath = undefined,
  migrations = undefined,
  reseed = undefined,
}: IProgramMigrateDBOptions = {}) => {
  const oldVal = process.env.TYPEORM_NO_SEL_DB;
  process.env.TYPEORM_NO_SEL_DB = 'true';

  let app = await cliAppFactory('programCreateDatabase', {
    project,
    envPath,
  });
  let service = app.get<DbOpsService>(DbOpsService);

  await service.create();
  await closeCli(app);
  await service.closeAllConnections();

  if (oldVal !== undefined) {
    process.env.TYPEORM_NO_SEL_DB = oldVal;
  } else {
    delete process.env.TYPEORM_NO_SEL_DB;
  }

  app = await cliAppFactory('programMigrateDatabase', {
    project,
    envPath,
  });
  service = app.get<DbOpsService>(DbOpsService);

  const configService = app.get<ConfigService>(ConfigService);
  const migrationPayload =
    configService.get<ICliServiceConf>(CLI_CONF_ALIAS)?.migrationPayload;

  setSeedingObject();

  await service.migrate({
    // get the migration payload from the command line or from the environment variable
    selMigrations: migrations || migrationPayload,
    reseed: reseed,
  });
  await closeCli(app);
};

export enum SeedType {
  NO_SEED = 'no-seed',
  SEED = 'seed',
  RESEED = 'reseed',
}

export interface IProgramCreateDBOptions extends IProgramDefOptions {
  withSchema?: boolean;
  dropDatabases?: boolean;
  seedType?: SeedType;
  migrations?: MigrationSelection;
  seedOrmConfigPath?: string;
}

export const programCreateDatabase = async ({
  withSchema = false,
  dropDatabases = false,
  seedType = SeedType.NO_SEED,
  project = undefined,
  envPath = undefined,
  migrations = undefined,
  seedOrmConfigPath = undefined,
}: IProgramCreateDBOptions) => {
  const oldValLogging = process.env.TYPEORM_LOGGING;
  process.env.TYPEORM_LOGGING = 'false';

  const oldVal = process.env.TYPEORM_NO_SEL_DB;
  process.env.TYPEORM_NO_SEL_DB = 'true';

  let app = await cliAppFactory('programCreateDatabase', {
    project,
    envPath,
    seedOrmConfigPath,
  });
  let service = app.get<DbOpsService>(DbOpsService);

  if (dropDatabases) {
    await service.drop();
  }

  await service.create();
  await closeCli(app);
  await service.closeAllConnections();
  if (oldVal !== undefined) {
    process.env.TYPEORM_NO_SEL_DB = oldVal;
  } else {
    delete process.env.TYPEORM_NO_SEL_DB;
  }
  // syncronization need connections with DB selection
  if (withSchema) {
    app = await cliAppFactory('programCreateDatabase withSchema', {
      project,
      envPath,
      seedOrmConfigPath,
    });
    service = app.get<DbOpsService>(DbOpsService);

    const configService = app.get<ConfigService>(ConfigService);
    const migrationPayload =
      configService.get<ICliServiceConf>(CLI_CONF_ALIAS)?.migrationPayload;

    await service.migrate({
      selMigrations: migrations || migrationPayload,
    });
    await closeCli(app);
  }

  if (seedType !== SeedType.NO_SEED) {
    app = await cliAppFactory('programCreateDatabase seed', {
      project,
      envPath,
      seedOrmConfigPath,
    }); // in this case we need to recreate the app to rebuild it with TYPEORM_NO_SEL_DB=false
    setSeedingObject();
    const seedService = app.get<SeedService>(SeedService);
    await seedService.seedDatabases(seedType === SeedType.RESEED);
    await closeCli(app);
  }

  if (oldValLogging !== undefined) {
    process.env.TYPEORM_LOGGING = oldValLogging;
  } else {
    delete process.env.TYPEORM_LOGGING;
  }
};

export const programSyncDatabase = async ({
  drop,
  project = undefined,
  envPath = undefined,
}: { drop: boolean } & IProgramDefOptions) => {
  const app = await cliAppFactory('programSyncDatabase', { project, envPath });
  const service = app.get<DbOpsService>(DbOpsService);
  await service.sync(drop);
  await closeCli(app);
};

export const programDropDatabase = async ({
  project = undefined,
  envPath = undefined,
}: IProgramDefOptions = {}) => {
  const oldVal = process.env.TYPEORM_NO_SEL_DB;
  process.env.TYPEORM_NO_SEL_DB = 'true';
  const app = await cliAppFactory('programDropDatabase', { project, envPath });
  const service = app.get<DbOpsService>(DbOpsService);
  await service.drop();
  await closeCli(app);
  process.env.TYPEORM_NO_SEL_DB = oldVal;
};

export interface IProgramExportOptions extends IProgramDefOptions {
  genPath?: string;
  tables?: string[];
}

export const programModelGenDatabase = async (
  dbName: string,
  {
    project = undefined,
    envPath = undefined,
    genPath,
    tables = [],
  }: IProgramExportOptions = {},
) => {
  const app = await cliAppFactory('programModelGenDatabase', {
    project,
    envPath,
  });
  const service = app.get<DbOpsService>(DbOpsService);
  await service.generate(dbName, tables, genPath);
  await closeCli(app);
};
