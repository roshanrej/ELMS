import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { LeaveRequestProjectionDTO } from '../../dtos/leave-request/leave-request.projection.dto';
import { ManagerEmployeeLeaveDTO } from '../../dtos/leave-request/manager-employee-leave.dto';
import { CreateLeaveRequestDTO } from '../../dtos/leave-request/create-leave-request.dto';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { LeaveRequestActionEnum } from '../../types-enums/leave-request-action.enum';
import { EmployeeLeaveRequestDTO } from '../../dtos/leave-request/employee-leave-request.dto';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestApi {
  
  private http: HttpClient = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  // Employee: My leave requests (projection - backend owns filtering/actions)

  getEmployeeLeaveDrafts() : Observable<ApiResponseDTO<LeaveRequestProjectionDTO[]>>{
      return this.http.get<ApiResponseDTO<LeaveRequestProjectionDTO[]>>(
      `${this.baseUrl}/employee/api/leave-requests/me/drafts`
    );
  }
  getEmployeeLeaveRequests(): Observable<ApiResponseDTO<EmployeeLeaveRequestDTO[]>> {
    return this.http.get<ApiResponseDTO<EmployeeLeaveRequestDTO[]>>(
      `${this.baseUrl}/employee/api/leave-requests/active/me`
    );
  }

getEmployeeLeaveProjections(): Observable<ApiResponseDTO<LeaveRequestProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<LeaveRequestProjectionDTO[]>>(
      `${this.baseUrl}/employee/api/leave-requests/me`
    );
  }

  // Employee: Create new leave request as PENDING
  submitNewLeaveRequest(dto: CreateLeaveRequestDTO): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.http.post<ApiResponseDTO<LeaveRequestProjectionDTO>>(
      `${this.baseUrl}/employee/api/leave-requests/submit`,
      dto
    );
  }
  submitExistingLeaveRequest(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>>{
     return this.http.post<ApiResponseDTO<LeaveRequestProjectionDTO>>(
      `${this.baseUrl}/employee/api/leave-requests/${id}/submit`,
    {}
    );
  }

  // Employee: Create new leave request as DRAFT
createLeaveDraft (dto: CreateLeaveRequestDTO): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.http.post<ApiResponseDTO<LeaveRequestProjectionDTO>>(
      `${this.baseUrl}/employee/api/leave-requests/draft`,
      dto
    );
  }

  // Generic action performer - backend decides validity via allowedActions
  
editLeaveDraft(
  id: number,
  dto: CreateLeaveRequestDTO
): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
  return this.http.put<ApiResponseDTO<LeaveRequestProjectionDTO>>(
    `${this.baseUrl}/employee/api/leave-requests/drafts/${id}/edit`,
    dto
  );
}

deleteLeaveDraft(
  id: number
): Observable<ApiResponseDTO<null>> {

  return this.http.post<ApiResponseDTO<null>>(
    `${this.baseUrl}/employee/api/leave-requests/drafts/${id}`,
    {
      
    }
  );
}
requestLeaveCancellation(id:number) : Observable<ApiResponseDTO<LeaveRequestProjectionDTO>>{
 return this.http.post<ApiResponseDTO<LeaveRequestProjectionDTO>>(
    `${this.baseUrl}/employee/api/leave-requests/${id}/request-cancel`,
    {}
  );
}
cancelLeaveRequest(id: number) :Observable<ApiResponseDTO<LeaveRequestProjectionDTO>>{
 return this.http.post<ApiResponseDTO<LeaveRequestProjectionDTO>>(
    `${this.baseUrl}/employee/api/leave-requests/${id}/cancel`,
    {}
  );
}
  // Manager: Team leave requests (projection with employee context)
  getTeamLeaveRequests(): Observable<ApiResponseDTO<ManagerEmployeeLeaveDTO[]>> {
    return this.http.get<ApiResponseDTO<ManagerEmployeeLeaveDTO[]>>(
      `${this.baseUrl}/api/leave-requests/team`
    );
  }

  // Admin/Manager: All or filtered (example)
  getAllLeaveRequests(): Observable<ApiResponseDTO<LeaveRequestProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<LeaveRequestProjectionDTO[]>>(
      `${this.baseUrl}/api/leave-requests`
    );
  }
}
