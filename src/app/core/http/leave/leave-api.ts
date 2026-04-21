import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LeaveRequestModel } from '../../models/leave-request.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveApi {
  private http: HttpClient = inject(HttpClient);
  private baseURL: string = 'http://localhost:3000/';

  getEmployeeLeaves(): Observable<unknown[]> {
    return this.http.get<unknown[] | null>(this.baseURL + 'api/leaves', {
      headers: {
        userId: '1',
      },
    }).pipe(
      map(data => data ?? [])
    );
  }

  requestLeave(requestData: LeaveRequestModel): Observable<unknown | null> {
    return this.http.post<unknown>(this.baseURL + 'api/request-leave',
      requestData,
      {
        headers: {
          userId: '1',
        },
      });
  }

  saveDraft(requestData: LeaveRequestModel): Observable<unknown | null> {
    return this.http.post<unknown>(this.baseURL + 'api/save-draft',
      requestData,
      {
        headers: {
          userId: '1',
        },
      });
  }
}
