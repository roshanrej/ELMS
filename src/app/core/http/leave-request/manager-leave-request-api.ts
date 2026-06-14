import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { ManagerEmployeeLeaveDTO } from '../../dtos/leave-request/manager-employee-leave.dto';
import { ManagerDashboardProjectionDTO } from '../../dtos/dashboard/manager-dashboard-projection.dto';
import { LeaveRequestProjectionDTO } from '../../dtos/leave-request/leave-request.projection.dto';
@Injectable({
  providedIn: 'root',
})
export class ManagerLeaveRequestApi {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getManagerOwnedLeaveRequests(): Observable<ApiResponseDTO<ManagerEmployeeLeaveDTO[]>> {
    return this.http.get<ApiResponseDTO<ManagerEmployeeLeaveDTO[]>>(
      `${this.baseUrl}/manager/api/leave-requests/team`,
    );
  }
  getManagerDashboardProjection(): Observable<ApiResponseDTO<ManagerDashboardProjectionDTO>> {
    return this.http.get<ApiResponseDTO<ManagerDashboardProjectionDTO>>(
      `${this.baseUrl}/manager/api/leave-requests/dashboard-projection`,
    );
  }

  approveLeaveRequest(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.http.post<ApiResponseDTO<LeaveRequestProjectionDTO>>(
      `${this.baseUrl}/manager/api/leave-requests/${id}/approve`,
      {},
    );
  }

  rejectLeaveRequest(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.http.post<ApiResponseDTO<LeaveRequestProjectionDTO>>(
      `${this.baseUrl}/manager/api/leave-requests/${id}/reject`,
      {},
    );
  }

  approveCancelRequest(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.http.post<ApiResponseDTO<LeaveRequestProjectionDTO>>(
      `${this.baseUrl}/manager/api/leave-requests/${id}/approve-cancel`,
      {},
    );
  }

  rejectCancelRequest(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.http.post<ApiResponseDTO<LeaveRequestProjectionDTO>>(
      `${this.baseUrl}/manager/api/leave-requests/${id}/reject-cancel`,
      {},
    );
  }
}
