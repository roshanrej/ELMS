import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LeaveBalanceProjectionDTO } from '../../../../core/dtos/leave-balance/leave-balance.projection.dto';
import { unwrapApiResponse } from '../../../../core/dtos/api/api-response.utils';
import { NotificationService } from '../../../../shared/services/notification.service';
import { EmployeeLeaveBalanceApi } from '../../../../core/http/leave-balance/employee-leave-balance-api';

@Injectable({
  providedIn: 'root',
})
export class LeaveBalanceService {
  private leaveBalanceApi = inject(EmployeeLeaveBalanceApi);
  private notifications = inject(NotificationService);
  private showApiError = (message: string): void => {
    this.notifications.showError(message);
  };

  getMyLeaveBalances(): Observable<LeaveBalanceProjectionDTO[]> {
    return this.leaveBalanceApi
      .getMyLeaveBalances()
      .pipe(map((res) => unwrapApiResponse(res, { fallback: [], onError: this.showApiError })));
  }
}
