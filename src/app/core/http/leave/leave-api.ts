import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LeaveRequestModel } from '../../models/leave/leave-request.model';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/api/api-reponse.model';
import { LeaveBalanceDto, LeaveDto, LeaveRequestDto, mapLeaveRequestModelToDto } from '../../mappers/leave/leave.mapper';

import { LeaveBalanceModel } from '../../models/leave/leave-balance.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveApi {
  private http: HttpClient = inject(HttpClient);
  private baseURL: string = environment.apiBaseUrl;

  getEmployeeLeaves(): Observable<LeaveDto[]> {
    return this.http.get<LeaveDto[] | null>(`${this.baseURL}/api/leaves`, {
    }).pipe(
      map(data => data ?? [])
    );
  }

  requestLeave(requestData: LeaveRequestModel): Observable<ApiResponse<LeaveDto>> {
    const dto: LeaveRequestDto = mapLeaveRequestModelToDto(requestData);
    return this.http.post<ApiResponse<LeaveDto>>(`${this.baseURL}/api/request-leave`,
      dto,
     );
  }

  saveDraft(requestData: LeaveRequestModel): Observable<ApiResponse<LeaveDto>> {
    const dto: LeaveRequestDto = mapLeaveRequestModelToDto(requestData);
    return this.http.post<ApiResponse<LeaveDto>>(`${this.baseURL}/api/save-draft`,
      dto,
);
  }
  getMyBalances(): Observable<LeaveBalanceDto[]> {
    return this.http.get<LeaveBalanceDto[]>(`${this.baseURL}/api/leaves/balance/me`);
  }
}
