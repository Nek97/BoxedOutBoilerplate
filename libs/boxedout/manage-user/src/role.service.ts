import { Injectable, Provider } from '@nestjs/common';
import { Role } from '@boxedout-libs/db-boxedoutAdmin/entities/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GenericService } from '@nestjs-yalc/ag-grid/generic-service.service';
import { RoleRepository } from '@boxedout-libs/db-boxedoutAdmin/boxedout-admin.repository';

export function RoleServiceFactory(boxedoutAdminDbConnName: string): Provider {
  return {
    provide: RoleService,
    useFactory: (roleRepository: RoleRepository) => {
      return new RoleService(roleRepository);
    },
    inject: [getRepositoryToken(Role, boxedoutAdminDbConnName)],
  };
}

@Injectable()
export class RoleService extends GenericService<Role> {
  constructor(roleRepository: RoleRepository) {
    super(roleRepository);
  }
}
