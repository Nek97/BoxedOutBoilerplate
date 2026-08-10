/* istanbul ignore file */
import { ProjectsEnum } from '@boxedout-libs/shared/def.const';
import 'source-map-support/register';

export const APP_ALIAS_AUTH_PROVIDER = ProjectsEnum.AUTH_PROVIDER;

export { lambdaServerHandler } from './lambda';
export { bootstrap, bootstrapDryRun } from './bootstrap';
