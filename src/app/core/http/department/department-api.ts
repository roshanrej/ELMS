import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { DepartmentProjectionDTO } from '../../dtos/department/department.projection.dto';
import { DepartmentStatusEnum } from '../../types-enums/department-status.enum';

@Injectable({
  providedIn: 'root',
})
export class DepartmentApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getDepartments(): Observable<ApiResponseDTO<DepartmentProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<DepartmentProjectionDTO[]>>(
      `${this.baseUrl}/admin/api/departments`,
    );
  }

  createDepartment(name: string): Observable<ApiResponseDTO<DepartmentProjectionDTO>> {
    return this.http.post<ApiResponseDTO<DepartmentProjectionDTO>>(
      `${this.baseUrl}/admin/api/departments/create`,
      { name },
    );
  }

  updateDepartmentStatus(
    departmentId: number,
    status: DepartmentStatusEnum,
  ): Observable<ApiResponseDTO<DepartmentProjectionDTO>> {
    return this.http.patch<ApiResponseDTO<DepartmentProjectionDTO>>(
      `${this.baseUrl}/admin/api/departments/${departmentId}/status`,
      { status },
    );
  }

  renameDepartment(
    departmentId: number,
    departmentName: string,
  ): Observable<ApiResponseDTO<DepartmentProjectionDTO>> {
    return this.http.patch<ApiResponseDTO<DepartmentProjectionDTO>>(
      `${this.baseUrl}/admin/api/departments/${departmentId}/rename`,
      { departmentName },
    );
  }
}