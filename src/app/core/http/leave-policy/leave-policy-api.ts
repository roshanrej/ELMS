import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { LeavePolicyProjectionDTO } from '../../dtos/leave-policy/leave-policy.projection.dto';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class LeavePolicyApi {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getActiveLeavePolicies(): Observable<ApiResponseDTO<LeavePolicyProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<LeavePolicyProjectionDTO[]>>(
      `${this.baseUrl}/employee/api/leave-policies/current/active`
    );
  }

  // For admin management of policies/quotas
  getAllLeavePolicies(): Observable<ApiResponseDTO<LeavePolicyProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<LeavePolicyProjectionDTO[]>>(
      `${this.baseUrl}/api/leave-policies`
    );
  }
}

