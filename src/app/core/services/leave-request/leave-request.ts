import { inject, Injectable } from '@angular/core';
import { LeaveApi } from '../../http/leave/leave-api';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequest {
  private leaveApi : LeaveApi = inject(LeaveApi)

  requestLeave(){
    
  }
}
