import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { LeaveBalanceProjectionDTO } from '../../dtos/leave-balance/leave-balance.projection.dto';

@Injectable({
  providedIn: 'root',
})
export class EmployeeLeaveBalanceApi {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  getMyLeaveBalances(): Observable<ApiResponseDTO<LeaveBalanceProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<LeaveBalanceProjectionDTO[]>>(
      `${this.baseUrl}/employee/api/leave-balances/me`,
    );
  }
}
