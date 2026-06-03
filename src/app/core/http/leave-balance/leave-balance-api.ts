import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { LeaveBalanceProjectionDTO } from '../../dtos/leave-balance/leave-balance.projection.dto';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveBalanceApi {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  // Employee: My leave balances (projection - backend computes remaining etc.)
  getMyLeaveBalances(): Observable<ApiResponseDTO<LeaveBalanceProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<LeaveBalanceProjectionDTO[]>>(
      `${this.baseUrl}/employee/api/leave-balances/me`
    );
  }

  // Manager/Admin: Team balances (if needed)
  getTeamLeaveBalances(): Observable<ApiResponseDTO<LeaveBalanceProjectionDTO[]>> {
    return this.http.get<ApiResponseDTO<LeaveBalanceProjectionDTO[]>>(
      `${this.baseUrl}/api/leave-balances/team`
    );
  }
}
