/* istanbul ignore file */

import { Context } from 'aws-lambda';
import * as awsLambdaFastify from 'aws-lambda-fastify';
import { ManagePanelModule } from '../manage-panel.module';
import { fastify } from 'fastify';
import { AwsResponse } from '@nestjs-yalc/aws-helpers/aws.interface';
import { AppBootstrap } from '@boxedout-libs/shared/app-helpers/app-bootstrap.helper';
import { APP_ALIAS_MANAGE_PANEL } from '..';
import { MANAGE_CONF_ALIAS } from '../config/service';
import { AwsServiceType, AwsSsmVariable } from '@boxedout-libs/shared/enum';

import { setEnvironmentVariableFromSsm } from '@nestjs-yalc/aws-helpers';
import { isAwsServiceEnabled } from '@boxedout-libs/shared/helpers/aws.helper';

let cachedProxy: (event: any, context: Context) => Promise<AwsResponse>;

// Binding object between provess env variable and ssm variable depending on the stage
const getSsmMySqlPassword = () => {
  return process.env.STAGE === 'dev'
    ? AwsSsmVariable.DB_BOXEDOUT_MASTER_PASSWORD
    : AwsSsmVariable.DB_CORE_API_PASSWORD;
};
const envVariableToDecrypt: {
  [key: string]: string;
} = {
  ['MYSQL_PASSWORD']: getSsmMySqlPassword(),
  ['JWT_SECRET_PVT']: AwsSsmVariable.JWT_SECRET_PVT,
  ['JWT_SECRET_PUB']: AwsSsmVariable.JWT_SECRET_PUB,
  ['MYSQL_REPLICA_PASSWORD_1']: getSsmMySqlPassword(),
};

async function bootstrap(): Promise<
  (event: any, context: Context) => Promise<AwsResponse>
> {
  const fastifyApp = fastify();

  if (isAwsServiceEnabled(AwsServiceType.SDK)) {
    await setEnvironmentVariableFromSsm(envVariableToDecrypt);
  }

  const bootstrap = await new AppBootstrap(
    APP_ALIAS_MANAGE_PANEL,
    MANAGE_CONF_ALIAS,
    ManagePanelModule.forRoot(),
  ).createApp({ fastifyInstanceOrOptions: fastifyApp });

  await bootstrap
    .applyBootstrapGlobals({
      apiPrefix: '',
    })
    .getApp()
    .init();

  return awsLambdaFastify(fastifyApp);
}

export async function lambdaServerHandler(
  event: any,
  context: Context,
): Promise<AwsResponse> {
  if (!cachedProxy) {
    const proxy = await bootstrap();
    cachedProxy = proxy;
  }

  const response = await cachedProxy(event, context);

  // only when invoke local
  if (process.env.IS_LOCAL) {
    process.exit(response.statusCode === 200 ? 0 : 1);
  }

  return response;
}
