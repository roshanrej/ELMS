import { Injectable } from '@angular/core';
import { Api } from '../../http/auth/api';
import { inject } from '@angular/core';
import { LeaveModel } from '../../models/leave-model';
import { Observable } from 'rxjs';
import { LeaveApi } from '../../http/leave/leave-api';
@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private leaveApi :LeaveApi= inject(LeaveApi)

  getEmployeeLeaves(): Observable<LeaveModel[]|null> {
     return this.leaveApi.getEmployeeLeaves() 
  }
  applyLeave(){

  }
}
