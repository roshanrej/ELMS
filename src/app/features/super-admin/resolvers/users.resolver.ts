import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { UserProjectionDTO } from '../../../core/dtos/user/user-projection.dto';
import { SuperAdminUserService } from '../services/super-admin-user.service';

export const superAdminUsersResolver: ResolveFn<UserProjectionDTO[]> = () => {
  return inject(SuperAdminUserService).loadUsers();
};