/* eslint-disable no-console */
/* istanbul ignore file */
import { AppBootstrap } from '@boxedout-libs/shared/app-helpers/app-bootstrap.helper';
import { APP_ALIAS_MANAGE_PANEL } from '.';
import { MANAGE_CONF_ALIAS } from './config/service';
import { ManagePanelModule } from './manage-panel.module';
import { ManagePanelService } from './manage-panel.service';

export async function bootstrapDryRun(
  envPath?: string | string[],
  exit = true,
) {
  const withDatabase = !process.env.APP_DRY_RUN_NO_DB;
  const app = await new AppBootstrap(
    APP_ALIAS_MANAGE_PANEL,
    MANAGE_CONF_ALIAS,
    ManagePanelModule.forRoot({
      envPath,
      setupAppModules: withDatabase,
      setupDatabases: withDatabase,
    }),
  ).createApp();

  console.log('______DRY RUN_____');
  try {
    const service = app.getApp().get<ManagePanelService>(ManagePanelService);
    console.log(service.getHello(APP_ALIAS_MANAGE_PANEL));
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
    APP_ALIAS_MANAGE_PANEL,
    MANAGE_CONF_ALIAS,
    ManagePanelModule.forRoot({
      envPath,
    }),
  ).createApp();

  app.applyBootstrapGlobals().listen();
}
