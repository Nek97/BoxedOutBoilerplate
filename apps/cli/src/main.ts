/* istanbul ignore file */

import {
  programCreateDatabase,
  programDropDatabase,
  programModelGenDatabase,
  programMigrateDatabase,
  programSeedDatabase,
  programSyncDatabase,
} from './cli.helper';
import { ProjectsEnum } from '@boxedout-libs/shared/def.const';
import { Command } from 'commander';
import { isAwsServiceEnabled } from '@boxedout-libs/shared/helpers/aws.helper';
import { AwsServiceType } from '@boxedout-libs/shared/enum/aws.enum';
export * from './lambda';

if (
  !(
    isAwsServiceEnabled(AwsServiceType.ENV) ||
    process.env.APP_DRY_RUN ||
    process.env.SLS_OFFLINE
  )
) {
  const program = new Command('cli');

  // const myParseInt = (input: string) => {
  //   const res = parseInt(input);
  //   return isNaN(res) ? 10 : res;
  // };

  const withErrors = (command: (...args: any[]) => Promise<void>) => {
    return async (...args: any[]) => {
      try {
        await command(...args);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exit(1);
      }
    };
  };

  const programDef = (commandName: string, description: string) => {
    return program
      .command(commandName)
      .description(description)
      .option(
        '-p, --project <name>',
        'Name of the project',
        ProjectsEnum.MANAGE_PANEL,
      )
      .option(
        '-e, --envPath <filePath...>',
        'Path of the environment file to use',
        process.env.APP_ENV_FILES || undefined,
      );
  };

  async function main() {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      process.env.NODE_ENV = 'development';
    }

    programDef('seed', 'Seed the databases')
      .option(
        '-i, --input <json>',
        'The json inputs to seed the database',
        JSON.parse,
      )
      .option('-r, --reseed', 'Reset the database before seeding', false)
      .option(
        '-l, --log',
        'Enable database query logs during seeding process (it can slow down the execution with large amount of data to seed)',
        false,
      )
      .action(
        withErrors(async ({ reseed, input, envPath, project, log }) => {
          await programSeedDatabase({
            log,
            reseed,
            seedingObject: input,
            envPath,
            project,
          });
        }),
      );

    programDef('migrate', 'Migrate databases')
      .option(
        '-m, --migrations <json>',
        'Provide a json to select migrations to run',
        JSON.parse,
      )
      .option('-r, --reseed', 'Reseed the database after the migration', false)
      .action(programMigrateDatabase);

    programDef('create', 'Create databases')
      .option(
        '-w, --withSchema',
        'Initialize the database with the schema',
        false,
      )
      .option('-d, --dropDatabases', 'Drop all databases before', false)
      .option(
        '-s, --seedType <type>',
        'Seed the database, available types are: seed, reseed, no-seed',
        'no-seed',
      )
      .action(withErrors(programCreateDatabase));

    programDef('sync', 'Synchronize databases')
      .option('-d, --drop', 'Drop the database before sync', false)
      .action(withErrors(programSyncDatabase));

    programDef('drop', 'Drop databases').action(programDropDatabase);

    programDef('generate <dbName>', 'Generate entity models from the database')
      .option(
        '-g, --genPath <path>',
        'Path where models must be exported',
        'var/models',
      )
      .option('-t, --tables <tables...>', 'Table names to export', '')
      .action(programModelGenDatabase);

    await program.parseAsync(process.argv);
  }

  main();
}
