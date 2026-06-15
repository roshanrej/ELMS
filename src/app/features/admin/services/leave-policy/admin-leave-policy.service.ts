import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { unwrapApiResponse } from '../../../../core/dtos/api/api-response.utils';
import { LeavePolicyProjectionDTO } from '../../../../core/dtos/leave-policy/leave-policy.projection.dto';
import { AdminLeavePolicyApi } from '../../../../core/http/leave-policy/admin-leave-policy-api';
import { NotificationService } from '../../../../shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AdminLeavePolicyService {
  private readonly api = inject(AdminLeavePolicyApi);
  private readonly notifications = inject(NotificationService);

  loadPoliciesForCurrentYear(): Observable<LeavePolicyProjectionDTO[]> {
    return this.loadPoliciesForYear(new Date().getFullYear());
  }

  loadPoliciesForYear(year: number): Observable<LeavePolicyProjectionDTO[]> {
    return this.api.getLeavePoliciesForYear(year).pipe(
      map((response) =>
        unwrapApiResponse(response, {
          fallback: [],
          onError: this.handleServiceError,
        }),
      ),
    );
  }

  private handleServiceError = (message: string): void => {
    this.notifications.showError(message);
  };
}