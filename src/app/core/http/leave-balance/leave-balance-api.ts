import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { LeaveBalanceProjectionDTO } from '../../dtos/leave-balance/leave-balance.projection.dto';
import { EmployeeLeaveBalanceApi } from './employee-leave-balance-api';
import { ManagerLeaveBalanceApi } from './manager-leave-balance-api';

/**
 * Backward-compatible facade for older imports.
 * New feature code should inject the role-specific API classes directly.
 */
@Injectable({
  providedIn: 'root',
})
export class LeaveBalanceApi {
  private employeeApi = inject(EmployeeLeaveBalanceApi);
  private managerApi = inject(ManagerLeaveBalanceApi);

  getMyLeaveBalances(): Observable<ApiResponseDTO<LeaveBalanceProjectionDTO[]>> {
    return this.employeeApi.getMyLeaveBalances();
  }

  getTeamLeaveBalances(): Observable<ApiResponseDTO<LeaveBalanceProjectionDTO[]>> {
    return this.managerApi.getTeamLeaveBalances();
  }
}
