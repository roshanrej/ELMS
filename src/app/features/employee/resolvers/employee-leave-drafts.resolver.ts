import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { LeaveRequestProjectionDTO } from '../../../core/dtos/leave-request/leave-request.projection.dto';
import { LeaveService } from '../services/leave-requests/leave-request.service';

export const employeeLeaveDraftsResolver: ResolveFn<LeaveRequestProjectionDTO[]> = () => {
  const service = inject(LeaveService);
  return service.getEmployeeLeaveDrafts().pipe(catchError(() => of([])));
};