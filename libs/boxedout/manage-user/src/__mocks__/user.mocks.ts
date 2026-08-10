import { ActiveSession } from '@boxedout-libs/db-boxedout/entities/active-session.entity';
import { createMock } from '@golevelup/ts-jest';
import { UserRepository } from '@boxedout-libs/db-boxedout/boxedout.repository';
import { RoleRepository } from '@boxedout-libs/db-boxedoutAdmin/boxedout-admin.repository';
import { AgGridRepository } from '@nestjs-yalc/ag-grid/ag-grid.repository';

export const fixedUserRepository = createMock<UserRepository>();
export const fixedRoleRepository = createMock<RoleRepository>();
export const fixedActiveSessionRepository =
  createMock<AgGridRepository<ActiveSession>>();
