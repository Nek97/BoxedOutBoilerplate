/* istanbul ignore file */

/**
 * This file is only used by typeorm-seeding library
 */

import { dbConf } from './database';

export default [...dbConf.map((fn) => fn())];
