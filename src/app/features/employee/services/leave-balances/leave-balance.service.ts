import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LeaveBalanceProjectionDTO } from '../../../../core/dtos/leave-balance/leave-balance.projection.dto';
import { LeaveBalanceApi } from '../../../../core/http/leave-balance/leave-balance-api';
@Injectable({
  providedIn: 'root',
})
export class LeaveBalanceService {
 private leaveBalanceApi = inject(LeaveBalanceApi);

  getMyLeaveBalances(): Observable<LeaveBalanceProjectionDTO[]> {
    return this.leaveBalanceApi.getMyLeaveBalances().pipe(
      map((res) => res.data ?? [])
    );
  }
}
