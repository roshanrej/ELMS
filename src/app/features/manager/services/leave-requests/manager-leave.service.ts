import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ManagerEmployeeLeaveDTO } from '../../../../core/dtos/leave-request/manager-employee-leave.dto';
import { unwrapApiResponse } from '../../../../core/dtos/api/api-response.utils';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ManagerLeaveRequestApi } from '../../../../core/http/leave-request/manager-leave-request-api';
import { ManagerDashboardProjectionDTO } from '../../../../core/dtos/dashboard/manager-dashboard-projection.dto';
import { LeaveRequestProjectionDTO } from '../../../../core/dtos/leave-request/leave-request.projection.dto';
/**
 * Manager-specific leave service.
 * Consumes backend team projections directly.
 * Actions limited to what backend returns in allowedActions.
 */
@Injectable({
  providedIn: 'root',
})
export class ManagerLeaveService {
  private managerLeaveRequestApi = inject(ManagerLeaveRequestApi);
  private notifications = inject(NotificationService);
  private showApiError = (message: string): void => {
    this.notifications.showError(message);
  };

  getManagerOwnedLeaveRequests(): Observable<ManagerEmployeeLeaveDTO[]> {
    return this.managerLeaveRequestApi
      .getManagerOwnedLeaveRequests()
      .pipe(map((res) => unwrapApiResponse(res, { fallback: [], onError: this.showApiError })));
  }
  
  getManagerDashboardProjection(): Observable<ManagerDashboardProjectionDTO> {
    return this.managerLeaveRequestApi
      .getManagerDashboardProjection()
      .pipe(map((res) => unwrapApiResponse(res, {
        fallback: {
          upcomingLeaves: [],
          pendingCount: 0,
          pendingCancelCount: 0,
        }, onError: this.showApiError,
      })));
  }

  approveLeaveRequest(id: number): Observable<LeaveRequestProjectionDTO> {
    return this.managerLeaveRequestApi
      .approveLeaveRequest(id)
      .pipe(map((res) => unwrapApiResponse(res, { onError: this.showApiError })));
  }

  rejectLeaveRequest(id: number): Observable<LeaveRequestProjectionDTO> {
    return this.managerLeaveRequestApi
      .rejectLeaveRequest(id)
      .pipe(map((res) => unwrapApiResponse(res, { onError: this.showApiError })));
  }

  approveLeaveCancel(id: number): Observable<LeaveRequestProjectionDTO> {
    return this.managerLeaveRequestApi
      .approveCancelRequest(id)
      .pipe(map((res) => unwrapApiResponse(res, { onError: this.showApiError })));
  }

  rejectLeaveCancel(id: number): Observable<LeaveRequestProjectionDTO> {
    return this.managerLeaveRequestApi
      .rejectCancelRequest(id)
      .pipe(map((res) => unwrapApiResponse(res, { onError: this.showApiError })));
  }
}
