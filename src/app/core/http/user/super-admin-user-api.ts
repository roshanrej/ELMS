import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { CreateUserRequestDTO } from '../../dtos/user/create-user-request.dto';
import { UserProjectionDTO } from '../../dtos/user/user-projection.dto';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminUserApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getUsers(): Observable<ApiResponseDTO<UserProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<UserProjectionDTO[]>>(
      `${this.baseUrl}/super-admin/api/users`,
    );
  }

  createUser(payload: CreateUserRequestDTO): Observable<ApiResponseDTO<UserProjectionDTO>> {
    return this.http.post<ApiResponseDTO<UserProjectionDTO>>(
      `${this.baseUrl}/super-admin/api/users/create`,
      payload,
    );
  }

  activateUser(userId: number): Observable<ApiResponseDTO<UserProjectionDTO>> {
    return this.http.patch<ApiResponseDTO<UserProjectionDTO>>(
      `${this.baseUrl}/super-admin/api/users/${userId}/activate`,
      null,
    );
  }

  deactivateUser(userId: number): Observable<ApiResponseDTO<UserProjectionDTO>> {
    return this.http.patch<ApiResponseDTO<UserProjectionDTO>>(
      `${this.baseUrl}/super-admin/api/users/${userId}/deactivate`,
      null,
    );
  }
}