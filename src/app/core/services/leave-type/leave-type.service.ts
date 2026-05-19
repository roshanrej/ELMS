import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LeaveTypeModel } from '../../models/leave/leave-type.model';
import { LeaveTypeApi } from '../../http/leave-type/leave-type-api';
import { inject } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class LeaveTypeService {
  getLeaveTypes() : Observable<LeaveTypeModel[]>{
    return inject(LeaveTypeApi).getLeaveTypes();
  }
}
