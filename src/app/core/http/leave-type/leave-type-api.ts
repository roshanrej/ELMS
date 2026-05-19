import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { LeaveTypeModel } from '../../models/leave/leave-type.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveTypeApi {
  private http = inject(HttpClient)
  private baseURL: string = environment.apiBaseUrl;

  getLeaveTypes() : Observable<LeaveTypeModel[]>{
    return this.http.get<LeaveTypeModel[]>(
      `${this.baseURL}/api/leave-types/`
    )
  }
}
