import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { LeavePolicyProjectionDTO } from '../../dtos/leave-policy/leave-policy.projection.dto';

@Injectable({
  providedIn: 'root',
})
export class AdminLeavePolicyApi {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getAllLeavePolicies(): Observable<ApiResponseDTO<LeavePolicyProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<LeavePolicyProjectionDTO[]>>(
      `${this.baseUrl}/api/leave-policies`,
    );
  }
}
