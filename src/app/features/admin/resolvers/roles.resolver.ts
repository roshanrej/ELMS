import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { AdminRoleApi, RoleDTO } from '../../../core/http/role/admin-role-api';
import { unwrapApiResponse } from '../../../core/dtos/api/api-response.utils';

export const adminRolesResolver: ResolveFn<RoleDTO[]> = () => {
  return inject(AdminRoleApi)
    .getRoles()
    .pipe(map((response) => unwrapApiResponse(response, { fallback: [] })));
};