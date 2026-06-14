import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { CreateLeaveRequestDTO } from '../../dtos/leave-request/create-leave-request.dto';
import { EmployeeLeaveRequestDTO } from '../../dtos/leave-request/employee-leave-request.dto';
import { LeaveRequestProjectionDTO } from '../../dtos/leave-request/leave-request.projection.dto';
import { ManagerEmployeeLeaveDTO } from '../../dtos/leave-request/manager-employee-leave.dto';
import { AdminLeaveRequestApi } from './admin-leave-request-api';
import { EmployeeLeaveRequestApi } from './employee-leave-request-api';
import { ManagerLeaveRequestApi } from './manager-leave-request-api';

/**
 * Backward-compatible facade for older imports.
 * New feature code should inject the role-specific API classes directly.
 */
@Injectable({
  providedIn: 'root',
})
export class LeaveRequestApi {
  private employeeApi = inject(EmployeeLeaveRequestApi);
  private managerApi = inject(ManagerLeaveRequestApi);
  private adminApi = inject(AdminLeaveRequestApi);

  getEmployeeLeaveDrafts(): Observable<ApiResponseDTO<LeaveRequestProjectionDTO[]>> {
    return this.employeeApi.getLeaveDrafts();
  }

  getEmployeeLeaveRequests(): Observable<ApiResponseDTO<EmployeeLeaveRequestDTO[]>> {
    return this.employeeApi.getActiveLeaveRequests();
  }

  getEmployeeLeaveProjections(): Observable<ApiResponseDTO<LeaveRequestProjectionDTO[]>> {
    return this.employeeApi.getLeaveRequestProjections();
  }

  submitNewLeaveRequest(
    dto: CreateLeaveRequestDTO,
  ): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.employeeApi.submitNewLeaveRequest(dto);
  }

  submitExistingLeaveRequest(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.employeeApi.submitExistingLeaveRequest(id);
  }

  createLeaveDraft(
    dto: CreateLeaveRequestDTO,
  ): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.employeeApi.createLeaveDraft(dto);
  }

  editLeaveDraft(
    id: number,
    dto: CreateLeaveRequestDTO,
  ): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.employeeApi.editLeaveDraft(id, dto);
  }

  deleteLeaveDraft(id: number): Observable<ApiResponseDTO<null>> {
    return this.employeeApi.deleteLeaveDraft(id);
  }

  requestLeaveCancellation(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.employeeApi.requestLeaveCancellation(id);
  }

  cancelLeaveRequest(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.employeeApi.cancelLeaveRequest(id);
  }

  getTeamLeaveRequests(): Observable<ApiResponseDTO<ManagerEmployeeLeaveDTO[]>> {
    return this.managerApi.getManagerOwnedLeaveRequests();
  }

  approveLeaveRequest(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.managerApi.approveLeaveRequest(id);
  }

  rejectLeaveRequest(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.managerApi.rejectLeaveRequest(id);
  }

  approveLeaveCancel(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.managerApi.approveCancelRequest(id);
  }

  rejectLeaveCancel(id: number): Observable<ApiResponseDTO<LeaveRequestProjectionDTO>> {
    return this.managerApi.rejectCancelRequest(id);
  }

  getAllLeaveRequests(): Observable<ApiResponseDTO<LeaveRequestProjectionDTO[]>> {
    return this.adminApi.getAllLeaveRequests();
  }
}
