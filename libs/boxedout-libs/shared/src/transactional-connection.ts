/* istanbul ignore file */

import { envIsTrue } from '@nestjs-yalc/utils/env.helper';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const transactionalConnection: TypeOrmModuleOptions = {
  name: 'globalConnection',
  type: 'mysql',
  extra: {
    decimalNumbers: true,
  },
  host: 'mysql',
  port:
    (process.env.MYSQL_PORT && parseInt(process.env.MYSQL_PORT, 10)) || 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD ?? process.env.MYSQL_ROOT_PASSWORD,
  synchronize: envIsTrue(process.env.TYPEORM_SYNCHRONIZE || 'false'),
  logging: envIsTrue(process.env.TYPEORM_LOGGING || 'false'),
};
