/* istanbul ignore file */

import { createE2EConfig } from '../../../../libs/common/jest/src/config/jest-def.config';

export const e2eConfigs = createE2EConfig(
  'user-provider',
  __dirname,
  `${__dirname}/../../../../`,
);
