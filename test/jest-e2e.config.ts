import { e2eConfigs as managePanelE2E } from '../apps/manage-panel/test/feature/jest-e2e.conf';
import { e2eConfigs as userProviderE2E } from '../apps/user-provider/test/feature/jest-e2e.conf';
import { e2eConfigs as gatewayE2E } from '../apps/gateway/test/feature/jest-e2e.conf';

const selectedProj = process.env.npm_config_bcaproj || 'all';

const projects = [];

if (selectedProj === 'all' || gatewayE2E.name === `e2e/${selectedProj}`) {
  projects.push(gatewayE2E);
}

if (selectedProj === 'all' || userProviderE2E.name === `e2e/${selectedProj}`) {
  projects.push(userProviderE2E);
}

if (selectedProj === 'all' || managePanelE2E.name === `e2e/${selectedProj}`) {
  projects.push(managePanelE2E);
}

export default {
  projects: projects,
};
