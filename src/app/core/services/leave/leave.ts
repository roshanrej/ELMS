import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LeaveApi } from '../../http/leave/leave-api';
import { LeaveModel } from '../../models/leave-model';
import { LeaveRequestModel } from '../../models/leave-request.model';
import { mapLeaveDtoToModel } from '../../mappers/leave.mapper';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private leaveApi: LeaveApi = inject(LeaveApi);

  getEmployeeLeaves(): Observable<LeaveModel[]> {
    return this.leaveApi.getEmployeeLeaves().pipe(
      map(leaves => leaves.map(mapLeaveDtoToModel))
    );
  }

  requestLeave(leaveRequest: LeaveRequestModel): Observable<LeaveModel | null> {
    return this.leaveApi.requestLeave(leaveRequest).pipe(
      map(leave => leave ? mapLeaveDtoToModel(leave) : null)
    );
  }

  saveDraft(leaveDraft: LeaveRequestModel): Observable<LeaveModel | null> {
    return this.leaveApi.saveDraft(leaveDraft).pipe(
      map(leave => leave ? mapLeaveDtoToModel(leave) : null)
    );
  }
}
