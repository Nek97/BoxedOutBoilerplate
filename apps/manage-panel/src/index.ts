/* istanbul ignore file */
import { ProjectsEnum } from '@boxedout-libs/shared/def.const';
import 'source-map-support/register';

export const APP_ALIAS_MANAGE_PANEL = ProjectsEnum.MANAGE_PANEL;

export { lambdaServerHandler } from './lambda';
export { bootstrap, bootstrapDryRun } from './bootstrap';
