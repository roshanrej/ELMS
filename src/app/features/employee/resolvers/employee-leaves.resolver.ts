import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { LeaveModel } from '../../../core/models/leave/leave-model';
import { map } from 'rxjs';

export const employeeLeavesResolver: ResolveFn<LeaveModel[]> = () => {
  const service = inject(LeaveService);

  return service.getEmployeeLeaves().pipe(
    map(data => data ?? [])
  );
};

