import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LeaveRequestProjectionDTO } from '../../../../core/dtos/leave-request/leave-request.projection.dto';
import { CreateLeaveRequestDTO } from '../../../../core/dtos/leave-request/create-leave-request.dto';
import { EmployeeLeaveRequestDTO } from '../../../../core/dtos/leave-request/employee-leave-request.dto';
import { NotificationService } from '../../../../shared/services/notification.service';
import {
  unwrapApiResponse,
  unwrapApiVoidResponse,
} from '../../../../core/dtos/api/api-response.utils';
import { EmployeeLeaveRequestApi } from '../../../../core/http/leave-request/employee-leave-request-api';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private leaveRequestApi = inject(EmployeeLeaveRequestApi);
  private notifications = inject(NotificationService);
  private showApiError = (message: string): void => {
    this.notifications.showError(message);
  };

  getEmployeeLeaveDrafts(): Observable<LeaveRequestProjectionDTO[]> {
    return this.leaveRequestApi
      .getLeaveDrafts()
      .pipe(map((res) => unwrapApiResponse(res, { fallback: [], onError: this.showApiError })));
  }

  getEmployeeActiveLeaveRequests(): Observable<EmployeeLeaveRequestDTO[]> {
    return this.leaveRequestApi
      .getActiveLeaveRequests()
      .pipe(map((res) => unwrapApiResponse(res, { fallback: [], onError: this.showApiError })));
  }

  getEmployeeLeaveRequestsProjections(): Observable<LeaveRequestProjectionDTO[]> {
    return this.leaveRequestApi
      .getLeaveRequestProjections()
      .pipe(map((res) => unwrapApiResponse(res, { fallback: [], onError: this.showApiError })));
  }

  submitExistingLeaveRequest(id: number): Observable<LeaveRequestProjectionDTO> {
    return this.leaveRequestApi
      .submitExistingLeaveRequest(id)
      .pipe(map((res) => unwrapApiResponse(res, { onError: this.showApiError })));
  }

  cancelLeaveRequest(id: number): Observable<LeaveRequestProjectionDTO> {
    return this.leaveRequestApi
      .cancelLeaveRequest(id)
      .pipe(map((res) => unwrapApiResponse(res, { onError: this.showApiError })));
  }

  requestLeaveCancellation(id: number): Observable<LeaveRequestProjectionDTO> {
    return this.leaveRequestApi
      .requestLeaveCancellation(id)
      .pipe(map((res) => unwrapApiResponse(res, { onError: this.showApiError })));
  }

  submitLeaveRequest(dto: CreateLeaveRequestDTO): Observable<LeaveRequestProjectionDTO> {
    return this.leaveRequestApi
      .submitNewLeaveRequest(dto)
      .pipe(map((res) => unwrapApiResponse(res, { onError: this.showApiError })));
  }

  createLeaveDraft(dto: CreateLeaveRequestDTO): Observable<LeaveRequestProjectionDTO> {
    return this.leaveRequestApi
      .createLeaveDraft(dto)
      .pipe(map((res) => unwrapApiResponse(res, { onError: this.showApiError })));
  }

  editLeaveDraft(id: number, dto: CreateLeaveRequestDTO): Observable<LeaveRequestProjectionDTO> {
    return this.leaveRequestApi
      .editLeaveDraft(id, dto)
      .pipe(map((res) => unwrapApiResponse(res, { onError: this.showApiError })));
  }

  deleteLeaveDraft(id: number): Observable<void> {
    return this.leaveRequestApi
      .deleteLeaveDraft(id)
      .pipe(map((res) => unwrapApiVoidResponse(res, { onError: this.showApiError })));
  }
}
