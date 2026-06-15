import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { LeavePolicyProjectionDTO } from '../../../core/dtos/leave-policy/leave-policy.projection.dto';
import { AdminLeavePolicyService } from '../services/leave-policy/admin-leave-policy.service';

export const adminLeavePoliciesResolver: ResolveFn<LeavePolicyProjectionDTO[]> = () => {
  return inject(AdminLeavePolicyService)
    .loadPoliciesForCurrentYear()
    .pipe(catchError(() => of([])));
};