import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LeaveRequestApi } from '../../../../core/http/leave-request/leave-request-api';
import { ManagerEmployeeLeaveDTO } from '../../../../core/dtos/leave-request/manager-employee-leave.dto';
import { LeaveRequestProjectionDTO } from '../../../../core/dtos/leave-request/leave-request.projection.dto';
import { LeaveRequestActionEnum } from '../../../../core/types-enums/leave-request-action.enum';
import { ApiResponseDTO } from '../../../../core/dtos/api/api-response.model';

/**
 * Manager-specific leave service.
 * Consumes backend team projections directly.
 * Actions limited to what backend returns in allowedActions.
 */
@Injectable({
  providedIn: 'root',
})
export class ManagerLeaveService {
  private leaveRequestApi = inject(LeaveRequestApi);

  getTeamLeaves(): Observable<ManagerEmployeeLeaveDTO[]> {
    return this.leaveRequestApi.getTeamLeaveRequests().pipe(
      map((res: ApiResponseDTO<ManagerEmployeeLeaveDTO[]>) => res.data ?? [])
    );
  }

  // Manager actions on a specific leave request (approve/reject/cancel etc)
}
