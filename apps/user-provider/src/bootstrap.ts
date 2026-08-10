/* eslint-disable no-console */
/* istanbul ignore file */
import { AppBootstrap } from '@boxedout-libs/shared/app-helpers/app-bootstrap.helper';
import { AUTH_CONF_ALIAS } from './config/service';
import { UserProviderModule } from './user-provider.module';
import { UserProviderService } from './user-provider.service';
import { APP_ALIAS_AUTH_PROVIDER } from '.';

export async function bootstrapDryRun(
  envPath?: string | string[],
  exit = true,
) {
  const withDatabase = !process.env.APP_DRY_RUN_NO_DB;
  const app = await new AppBootstrap(
    APP_ALIAS_AUTH_PROVIDER,
    AUTH_CONF_ALIAS,
    UserProviderModule.forRoot({
      envPath,
      setupAppModules: withDatabase,
      setupDatabases: withDatabase,
    }),
  ).createApp();

  console.log('______DRY RUN_____');
  try {
    const service = app.getApp().get<UserProviderService>(UserProviderService);
    console.log(service.getHello(APP_ALIAS_AUTH_PROVIDER));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  if (exit) process.exit(0);
}

/**
 * Bootstrap nest application
 */
export async function bootstrap(envPath?: string | string[]) {
  console.debug('Application bootstrap');

  const app = await new AppBootstrap(
    APP_ALIAS_AUTH_PROVIDER,
    AUTH_CONF_ALIAS,
    UserProviderModule.forRoot({
      envPath,
    }),
  ).createApp();

  app.applyBootstrapGlobals().listen();
}
