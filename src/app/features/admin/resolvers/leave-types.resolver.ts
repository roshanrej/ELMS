import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { LeaveTypeProjectionDTO } from '../../../core/dtos/leave-type/leave-type.projection.dto';
import { AdminLeaveTypeService } from '../services/leave-type/admin-leave-type.service';

export const adminLeaveTypesResolver: ResolveFn<LeaveTypeProjectionDTO[]> = () => {
  return inject(AdminLeaveTypeService).getAllLeaveTypes().pipe(catchError(() => of([])));
};
