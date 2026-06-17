import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { unwrapApiResponse } from '../../../core/dtos/api/api-response.utils';
import { RoleDTO } from '../../../core/http/role/admin-role-api';
import { SuperAdminRoleApi } from '../../../core/http/role/super-admin-role-api';

export const superAdminRolesResolver: ResolveFn<RoleDTO[]> = () => {
  return inject(SuperAdminRoleApi)
    .getRoles()
    .pipe(map((response) => unwrapApiResponse(response, { fallback: [] })));
};