/* istanbul ignore file */

import {
  programCreateDatabase,
  programSeedDatabase,
} from '@boxedout-app/cli/cli.helper';
import { AwsSsmVariable } from '@boxedout-libs/shared/enum';

import { setEnvironmentVariableFromSsm } from '@nestjs-yalc/aws-helpers';
import { isAwsServiceEnabled } from '@boxedout-libs/shared/helpers/aws.helper';
import { AwsServiceType } from '@boxedout-libs/shared/enum/aws.enum';
import { STAGES } from '@boxedout-libs/shared/def.const';

// Binding object between provess env variable and ssm variable depending on the stage
const getSsmMySqlPassword = () => {
  return process.env.STAGE === STAGES.PROD
    ? AwsSsmVariable.DB_CORE_API_CLI_PASSWORD
    : AwsSsmVariable.DB_BOXEDOUT_MASTER_PASSWORD;
};
const envVariableToDecrypt: {
  [key: string]: string;
} = {
  ['MYSQL_PASSWORD']: getSsmMySqlPassword(),
  ['JWT_SECRET_PVT']: AwsSsmVariable.JWT_SECRET_PVT,
  ['JWT_SECRET_PUB']: AwsSsmVariable.JWT_SECRET_PUB,
};

/**
 * Helper function to run a CLI command with the exception
 * correctly handled by lambda
 *
 * @param method the function/command to run, remember to bind your parameters
 * @param message the message to return if the command succeeds
 * @returns response
 */
async function runOperation(
  method: (...args: any) => Promise<void>,
  message: string,
) {
  try {
    if (isAwsServiceEnabled(AwsServiceType.SDK)) {
      await setEnvironmentVariableFromSsm(envVariableToDecrypt);
    }

    await method();
  } catch (error) {
    // apparently the only way to let lambda exit
    // after an error is by catching it here
    // and set a promise rejection. We should investigate why it's happening
    // since it should exit automatically after a thrown error
    Promise.reject(error);

    return;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
    }),
  };
}

export async function runMigrations(selMigrations: any) {
  if (!selMigrations || Object.keys(selMigrations).length === 0) {
    // in production, do not execute any migration if not specified
    // we only support explicit migrations on lambda
    selMigrations = process.env.NODE_ENV === 'production' ? {} : undefined;
  }

  if (isAwsServiceEnabled(AwsServiceType.SDK)) {
    await setEnvironmentVariableFromSsm(envVariableToDecrypt);
  }

  return runOperation(
    programCreateDatabase.bind(null, {
      withSchema: true,
      migrations: selMigrations,
    }),
    'Migration Completed',
  );
}

export async function runSeeds(event: any) {
  const { reseed, seedingObject } = event;

  if (isAwsServiceEnabled(AwsServiceType.SDK)) {
    await setEnvironmentVariableFromSsm(envVariableToDecrypt);
  }

  return runOperation(
    programSeedDatabase.bind(null, { reseed, seedingObject }),
    'Seeding completed',
  );
}

/**
 * This lambda executes a DB reinitialization by dropping and re-creating the database
 * It also performs migrations
 *
 * @param _event
 * @param _context
 * @param callback
 */
export async function runReinit() {
  if (isAwsServiceEnabled(AwsServiceType.SDK)) {
    await setEnvironmentVariableFromSsm(envVariableToDecrypt);
  }
  return runOperation(
    programCreateDatabase.bind(null, { dropDatabases: true, withSchema: true }),
    'DB re-initialization completed',
  );
}
