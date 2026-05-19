import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LeaveApi } from '../../http/leave/leave-api';
import { LeaveModel } from '../../models/leave/leave-model';
import { LeaveRequestModel } from '../../models/leave/leave-request.model';
import { mapLeaveBalanceDtoToModel, mapLeaveDtoToModel } from '../../mappers/leave/leave.mapper';
import { LeaveBalanceModel } from '../../models/leave/leave-balance.model';
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
    map( res => {
      if (!res.success || !res.data) return null;
      return mapLeaveDtoToModel(res.data);
    })
  );
}

  saveDraft(leaveDraft: LeaveRequestModel): Observable<LeaveModel | null> {
    return this.leaveApi.saveDraft(leaveDraft).pipe(
       map( res => {
      if (!res.success || !res.data) return null;
      return mapLeaveDtoToModel(res.data);
    })
    );
  }
   getMyBalances():Observable<LeaveBalanceModel[]>{
    return this.leaveApi.getMyBalances().pipe(
      map((balances) => balances.map(mapLeaveBalanceDtoToModel))
    );
   }
}
