import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { UserProjectionDTO } from '../../../core/dtos/user/user-projection.dto';
import { AdminUserService } from '../services/user/admin-user.service';

export const adminEmployeesResolver: ResolveFn<UserProjectionDTO[]> = () => {
  return inject(AdminUserService)
    .loadUsers()
    .pipe(catchError(() => of([])));
};