import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LeaveService } from '../../../core/services/leave/leave';
import { LeaveModel } from '../../../core/models/leave-model';
import { map } from 'rxjs/operators';

export const leavesResolver: ResolveFn<LeaveModel[]> = () => {
  const service = inject(LeaveService);

  return service.getEmployeeLeaves().pipe(
    map(data => data ?? [])
  );
};