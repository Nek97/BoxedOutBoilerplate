/* istanbul ignore file */
import { Command } from 'commander';
import { APP_ALIAS_KAKFA_APP } from '.';
import { bootstrap, bootstrapDryRun } from './bootstrap';

// Application bootstrap KAFKA

const program = new Command(APP_ALIAS_KAKFA_APP);

program
  .option(
    '-e, --envFile <filePath...>',
    'Path of the environment file to use',
    process.env.APP_ENV_FILES || undefined,
  )
  .parse();

const opts = program.opts();

process.env.APP_DRY_RUN
  ? bootstrapDryRun(opts.envFile)
  : bootstrap(opts.envFile);
