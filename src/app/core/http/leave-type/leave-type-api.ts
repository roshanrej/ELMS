import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';

export interface LeaveTypeOption {
  name: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class LeaveTypeApi {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  // Returns active leave type names (or use LeavePolicyProjectionDTO instead in practice)
  getLeaveTypes(): Observable<ApiResponseDTO<LeaveTypeOption[]>> {
    return this.http.get<ApiResponseDTO<LeaveTypeOption[]>>(
      `${this.baseUrl}/api/leave-types`
    );
  }
}

