import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';

export interface RoleDTO {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminRoleApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getRoles(): Observable<ApiResponseDTO<RoleDTO[]>> {
    return this.http.get<ApiResponseDTO<RoleDTO[]>>(`${this.baseUrl}/admin/api/roles`);
  }
}