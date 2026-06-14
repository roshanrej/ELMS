import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { CreateLeaveRequestDTO } from '../../dtos/leave-request/create-leave-request.dto';
import { EmployeeLeaveRequestDTO } from '../../dtos/leave-request/employee-leave-request.dto';
import { LeaveRequestProjectionDTO } from '../../dtos/leave-request/leave-request.projection.dto';

@Injectable({
  providedIn: 'root',
})
export class EmployeeLeaveRequestApi {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getLeaveDrafts(): Observable<ApiResponseDTO<LeaveRequestProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<LeaveRequestProjectionDTO[]>>(
      `${this.baseUrl}/employee/api/leave-requests/me/drafts`,
    );
  }

  getActiveLeaveRequests(): Observable<ApiResponseDTO<EmployeeLeaveRequestDTO[]>> {
    return this.http.get<ApiResponseDTO<EmployeeLeaveRequestDTO[]>>(
      `${this.baseUrl}/employee/api/leave-requests/active/me`,
    );
  }

  getLeaveRequestProjections(): Observable<ApiResponseDTO<LeaveRequestProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<LeaveRequestProjectionDTO[]>>(
      `${this.baseUrl}/employee/api/leave-requests/me`,
    );
  }

  submitNewLeaveRequest(
    dto: CreateLeaveRequestDTO,
  ): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.http.post<ApiResponseDTO<LeaveRequestProjectionDTO>>(
      `${this.baseUrl}/employee/api/leave-requests/submit`,
      dto,
    );
  }

  submitExistingLeaveRequest(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.http.post<ApiResponseDTO<LeaveRequestProjectionDTO>>(
      `${this.baseUrl}/employee/api/leave-requests/${id}/submit`,
      {},
    );
  }

  createLeaveDraft(
    dto: CreateLeaveRequestDTO,
  ): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.http.post<ApiResponseDTO<LeaveRequestProjectionDTO>>(
      `${this.baseUrl}/employee/api/leave-requests/draft`,
      dto,
    );
  }

  editLeaveDraft(
    id: number,
    dto: CreateLeaveRequestDTO,
  ): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.http.put<ApiResponseDTO<LeaveRequestProjectionDTO>>(
      `${this.baseUrl}/employee/api/leave-requests/drafts/${id}/edit`,
      dto,
    );
  }

  deleteLeaveDraft(id: number): Observable<ApiResponseDTO<null>> {
    return this.http.post<ApiResponseDTO<null>>(
      `${this.baseUrl}/employee/api/leave-requests/drafts/${id}/delete`,
      {},
    );
  }

  requestLeaveCancellation(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.http.post<ApiResponseDTO<LeaveRequestProjectionDTO>>(
      `${this.baseUrl}/employee/api/leave-requests/${id}/request-cancel`,
      {},
    );
  }

  cancelLeaveRequest(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.http.post<ApiResponseDTO<LeaveRequestProjectionDTO>>(
      `${this.baseUrl}/employee/api/leave-requests/${id}/cancel`,
      {},
    );
  }
}
