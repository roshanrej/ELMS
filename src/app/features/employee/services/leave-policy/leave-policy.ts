import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LeavePolicyProjectionDTO } from '../../../../core/dtos/leave-policy/leave-policy.projection.dto';
import { unwrapApiResponse } from '../../../../core/dtos/api/api-response.utils';
import { NotificationService } from '../../../../shared/services/notification.service';
import { EmployeeLeavePolicyApi } from '../../../../core/http/leave-policy/employee-leave-policy-api';

/**
 * Thin policy service - returns backend projections directly.
 */
@Injectable({
  providedIn: 'root',
})
export class LeavePolicyService {
  private api = inject(EmployeeLeavePolicyApi);
  private notifications = inject(NotificationService);
  private showApiError = (message: string): void => {
    this.notifications.showError(message);
  };

  getActivePolicies(): Observable<LeavePolicyProjectionDTO[]> {
    return this.api
      .getActiveLeavePolicies()
      .pipe(map((res) => unwrapApiResponse(res, { fallback: [], onError: this.showApiError })));
  }
}
