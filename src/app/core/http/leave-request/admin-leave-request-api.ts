import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { LeaveRequestProjectionDTO } from '../../dtos/leave-request/leave-request.projection.dto';

@Injectable({
  providedIn: 'root',
})
export class AdminLeaveRequestApi {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getAllLeaveRequests(): Observable<ApiResponseDTO<LeaveRequestProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<LeaveRequestProjectionDTO[]>>(
      `${this.baseUrl}/api/leave-requests`,
    );
  }
}
