import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { EmployeeLeaveRequestDTO } from '../../../core/dtos/leave-request/employee-leave-request.dto';
import { LeaveRequestProjectionDTO } from '../../../core/dtos/leave-request/leave-request.projection.dto';
import { LeaveService } from '../services/leave-requests/leave-request.service';

export const employeeActiveLeaveRequestsResolver: ResolveFn<EmployeeLeaveRequestDTO[]> = () => {
  const service = inject(LeaveService);
  return service.getEmployeeActiveLeaveRequests().pipe(catchError(() => of([])));
};

export const employeeLeaveRequestsResolver: ResolveFn<LeaveRequestProjectionDTO[]> = () => {
  const service = inject(LeaveService);
  return service.getEmployeeLeaveRequestsProjections().pipe(catchError(() => of([])));
};