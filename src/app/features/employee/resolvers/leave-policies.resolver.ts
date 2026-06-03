import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { LeavePolicyService } from '../services/leave-policy/leave-policy';
import { LeavePolicyProjectionDTO } from '../../../core/dtos/leave-policy/leave-policy.projection.dto';

export const leavePoliciesResolver: ResolveFn<LeavePolicyProjectionDTO[]> = () => {
  return inject(LeavePolicyService)
    .getActivePolicies()
    .pipe(
      map((policies) => policies ?? []),
      catchError(() => of([]))
    );
};

