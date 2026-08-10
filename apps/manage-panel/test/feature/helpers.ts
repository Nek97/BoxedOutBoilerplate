/* istanbul ignore file */

import { programCreateDatabase, SeedType } from '@boxedout-app/cli/cli.helper';
import { ProjectsEnum } from '@boxedout-libs/shared/def.const';

export async function prepareDatabase() {
  await programCreateDatabase({
    dropDatabases: false,
    withSchema: true,
    seedType: SeedType.RESEED,
    project: ProjectsEnum.MANAGE_PANEL,
    seedOrmConfigPath: `${__dirname}/../../config/`,
  });
}
