import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { AdminLeaveTypeService } from '../services/leave-type/admin-leave-type.service';
import { LeaveTypeProjectionDTO } from '../../../core/dtos/leave-type/leave-type.projection.dto';

export const adminLeaveTypesResolver: ResolveFn<LeaveTypeProjectionDTO[]> = () => {
  return inject(AdminLeaveTypeService).getAllLeaveTypes();
};
