import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LeaveRequestModel } from '../../models/leave/leave-request.model';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/api/api-reponse.model';
import { LeaveDto } from '../../mappers/leave/leave.mapper';

import { LeaveBalanceModel } from '../../models/leave/leave-balance.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveApi {
  private http: HttpClient = inject(HttpClient);
  private baseURL: string = environment.apiBaseUrl;

  getEmployeeLeaves(): Observable<unknown[]> {
    return this.http.get<unknown[] | null>(`${this.baseURL}/api/leaves`, {
    }).pipe(
      map(data => data ?? [])
    );
  }

  requestLeave(requestData: LeaveRequestModel): Observable<ApiResponse<LeaveDto>> {
    return this.http.post<ApiResponse<LeaveDto>>(`${this.baseURL}/api/request-leave`,
      requestData,
     );
  }

  saveDraft(requestData: LeaveRequestModel): Observable<ApiResponse<LeaveDto>> {
    return this.http.post<ApiResponse<LeaveDto>>(`${this.baseURL}/api/save-draft`,
      requestData,
);
  }
  getMyBalances(): Observable<LeaveBalanceModel[]> {

   
    return this.http.get<LeaveBalanceModel[]>(`${this.baseURL}/api/leaves/balance/me`);
  }
}
