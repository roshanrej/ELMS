import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ManagerDashboardProjectionDTO } from '../../../core/dtos/dashboard/manager-dashboard-projection.dto';
import { ManagerLeaveService } from '../services/leave-requests/manager-leave.service';

export const managerDashboardDetailsResolver: ResolveFn<ManagerDashboardProjectionDTO | null> =
  () => {
    const service = inject(ManagerLeaveService);
    return service.getManagerDashboardProjection().pipe(catchError(() => of(null)));
  };