import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LeavePolicyApi } from '../../../../core/http/leave-policy/leave-policy-api';
import { LeavePolicyProjectionDTO } from '../../../../core/dtos/leave-policy/leave-policy.projection.dto';
import { ApiResponseDTO } from '../../../../core/dtos/api/api-response.model';

/**
 * Thin policy service - returns backend projections directly.
 */
@Injectable({
  providedIn: 'root',
})
export class LeavePolicyService {
  private api = inject(LeavePolicyApi);

  getActivePolicies(): Observable<LeavePolicyProjectionDTO[]> {
    return this.api.getActiveLeavePolicies().pipe(
      map((res: ApiResponseDTO<LeavePolicyProjectionDTO[]>) => res.data ?? [])
    );
  }
}

