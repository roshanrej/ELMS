import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LeaveService } from '../../../core/services/leave/leave';
import { LeaveModel } from '../../../core/models/leave/leave-model';
import { map ,catchError} from 'rxjs/operators';
import { of } from 'rxjs';
import { LeaveBalanceModel } from '../../../core/models/leave/leave-balance.model';

export const leavesResolver: ResolveFn<LeaveModel[]> = () => {
  const service = inject(LeaveService);

  return service.getEmployeeLeaves().pipe(
    map(data => data ?? [])
  );
};

export const leaveBalancesResolver: ResolveFn<LeaveBalanceModel[]> = () => {
  return inject(LeaveService)
    .getMyBalances()
    .pipe(catchError(() => of([])));
};