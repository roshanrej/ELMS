import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { DepartmentProjectionDTO } from '../../../core/dtos/department/department.projection.dto';
import { AdminDepartmentService } from '../services/department/admin-department.service';

export const adminDepartmentsResolver: ResolveFn<DepartmentProjectionDTO[]> = () => {
  return inject(AdminDepartmentService)
    .loadDepartments()
    .pipe(catchError(() => of([])));
};