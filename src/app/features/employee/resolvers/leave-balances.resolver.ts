import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { of, catchError } from 'rxjs';

import { LeaveBalanceProjectionDTO } from '../../../core/dtos/leave-balance/leave-balance.projection.dto';
import { LeaveBalanceService } from '../services/leave-balances/leave-balance.service';

export const employeeLeaveBalancesResolver: ResolveFn<LeaveBalanceProjectionDTO[]> = () => {
  return inject(LeaveBalanceService)
    .getMyLeaveBalances()
    .pipe(catchError(() => of([])));
};

