import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { LeaveTypeProjectionDTO } from '../../dtos/leave-type/leave-type.projection.dto';
import { CreateLeaveTypeDTO } from '../../dtos/leave-type/create-leave-type.dto';
import { CreateLeaveTypeResponseDTO } from '../../dtos/leave-type/create-leave-type-response.dto';
import { UpdateLeaveTypeStatusDTO } from '../../dtos/leave-type/update-leave-type-status.dto';
import { RenameLeaveTypeDTO } from '../../dtos/leave-type/rename-leave-type.dto';

@Injectable({
  providedIn: 'root',
})
export class AdminLeaveTypeApi {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  createLeaveType(dto: CreateLeaveTypeDTO): Observable<ApiResponseDTO<CreateLeaveTypeResponseDTO>> {
    return this.http.post<ApiResponseDTO<CreateLeaveTypeResponseDTO>>(
      `${this.baseUrl}/admin/api/leave-types/create`,
      dto
    );
  }

  getAllLeaveTypes(): Observable<ApiResponseDTO<LeaveTypeProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<LeaveTypeProjectionDTO[]>>(
      `${this.baseUrl}/admin/api/leave-types`
    );
  }

  getActiveLeaveTypes(): Observable<ApiResponseDTO<string[]>> {
    return this.http.get<ApiResponseDTO<string[]>>(
      `${this.baseUrl}/admin/api/leave-types/active`
    );
  }

  updateStatus(id: number, dto: UpdateLeaveTypeStatusDTO): Observable<ApiResponseDTO<LeaveTypeProjectionDTO>> {
    return this.http.patch<ApiResponseDTO<LeaveTypeProjectionDTO>>(
      `${this.baseUrl}/admin/api/leave-types/${id}/status`,
      dto
    );
  }

  rename(id: number, dto: RenameLeaveTypeDTO): Observable<ApiResponseDTO<LeaveTypeProjectionDTO>> {
    return this.http.patch<ApiResponseDTO<LeaveTypeProjectionDTO>>(
      `${this.baseUrl}/admin/api/leave-types/${id}/rename`,
      dto
    );
  }
}
