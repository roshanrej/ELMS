import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { LeavePolicyProjectionDTO } from '../../dtos/leave-policy/leave-policy.projection.dto';
import { AdminLeavePolicyApi } from './admin-leave-policy-api';
import { EmployeeLeavePolicyApi } from './employee-leave-policy-api';

/**
 * Backward-compatible facade for older imports.
 * New feature code should inject the role-specific API classes directly.
 */
@Injectable({
  providedIn: 'root',
})
export class LeavePolicyApi {
  private employeeApi = inject(EmployeeLeavePolicyApi);
  private adminApi = inject(AdminLeavePolicyApi);

  getActiveLeavePolicies(): Observable<ApiResponseDTO<LeavePolicyProjectionDTO[]>> {
    return this.employeeApi.getActiveLeavePolicies();
  }

  getAllLeavePolicies(): Observable<ApiResponseDTO<LeavePolicyProjectionDTO[]>> {
    return this.adminApi.getAllLeavePolicies();
  }
}
