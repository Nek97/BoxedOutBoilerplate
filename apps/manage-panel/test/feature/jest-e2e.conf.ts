/* istanbul ignore file */

import { createE2EConfig } from '../../../../libs/common/jest/src/config/jest-def.config';

// it's not possible to import the ProjectEnum here, the alias must be hardcoded
export const e2eConfigs = createE2EConfig(
  'manage-panel',
  __dirname,
  `${__dirname}/../../../../`,
);
