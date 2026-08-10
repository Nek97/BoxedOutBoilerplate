/* istanbul ignore file */
import { envIsTrue } from '@nestjs-yalc/utils/env.helper';
import { isAwsServiceEnabled } from '@boxedout-libs/shared/helpers/aws.helper';
import { AwsServiceType } from '@boxedout-libs/shared/enum/aws.enum';
import { Command } from 'commander';
import {
  bootstrap,
  bootstrapDryRun,
  APP_ALIAS_MANAGE_PANEL,
  lambdaServerHandler,
} from './index';

export { APP_ALIAS_MANAGE_PANEL, lambdaServerHandler };

process.setMaxListeners(11);

if (
  !(
    isAwsServiceEnabled(AwsServiceType.ENV) ||
    envIsTrue(process.env.SLS_OFFLINE) ||
    envIsTrue(process.env.INCLUDE_ONLY)
  )
) {
  const program = new Command(APP_ALIAS_MANAGE_PANEL);

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
}
