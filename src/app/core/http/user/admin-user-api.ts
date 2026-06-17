import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { UserProjectionDTO } from '../../dtos/user/user-projection.dto';

@Injectable({
  providedIn: 'root',
})
export class AdminUserApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getUsers(): Observable<ApiResponseDTO<UserProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<UserProjectionDTO[]>>(
      `${this.baseUrl}/admin/api/users`,
    );
  }

  getActiveUsers(): Observable<ApiResponseDTO<UserProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<UserProjectionDTO[]>>(
      `${this.baseUrl}/admin/api/users/active`,
    );
  }

  assignUserToTeam(userId: number, teamId: number): Observable<ApiResponseDTO<UserProjectionDTO>> {
    return this.http.patch<ApiResponseDTO<UserProjectionDTO>>(
      `${this.baseUrl}/admin/api/users/${userId}/team/${teamId}`,
      null,
    );
  }

  assignUserRole(userId: number, roleId: number): Observable<ApiResponseDTO<UserProjectionDTO>> {
    return this.http.patch<ApiResponseDTO<UserProjectionDTO>>(
      `${this.baseUrl}/admin/api/users/${userId}/role/${roleId}`,
      null,
    );
  }

  assignUserDepartment(
    userId: number,
    departmentId: number,
  ): Observable<ApiResponseDTO<UserProjectionDTO>> {
    return this.http.patch<ApiResponseDTO<UserProjectionDTO>>(
      `${this.baseUrl}/admin/api/users/${userId}/department/${departmentId}`,
      null,
    );
  }
}