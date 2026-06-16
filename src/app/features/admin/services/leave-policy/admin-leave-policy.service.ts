import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { unwrapApiResponse } from '../../../../core/dtos/api/api-response.utils';
import { LeavePolicyProjectionDTO } from '../../../../core/dtos/leave-policy/leave-policy.projection.dto';
import { LeaveTypeStatusEnum } from '../../../../core/types-enums/leave-type-status-enum';
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

  createLeavePolicy(dto: {
    leaveType: string;
    year: number;
    allocatedLeave: number;
    noticePeriodDays: number;
  }): Observable<LeavePolicyProjectionDTO> {
    return this.api.createLeavePolicy(dto).pipe(
      map((response) => {
        const created = unwrapApiResponse(response, { onError: this.handleServiceError });
        return {
          leaveTypeName: created.leaveType,
          year: created.year,
          allocatedLeave: created.allocatedLeave,
          status: LeaveTypeStatusEnum.ACTIVE,
        };
      }),
    );
  }

  private handleServiceError = (message: string): void => {
    this.notifications.showError(message);
  };
}