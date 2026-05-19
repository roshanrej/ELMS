import { ResolveFn } from '@angular/router';
import { map}  from 'rxjs';
import { LeaveTypeModel } from '../../../core/models/leave/leave-type.model';
import { inject } from '@angular/core';
import { LeaveTypeService } from '../../../core/services/leave-type/leave-type.service';



export const leaveTypesResolver: ResolveFn<LeaveTypeModel[]> = () => {
  return inject(LeaveTypeService).getLeaveTypes().pipe(map(data => data ?? []))
};
