import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ManagerEmployeeLeaveDTO } from '../../../core/dtos/leave-request/manager-employee-leave.dto';
import { ManagerLeaveService } from '../services/leave-requests/manager-leave.service';

export const managerOwnedLeavesResolver: ResolveFn<ManagerEmployeeLeaveDTO[]> = () => {
  return inject(ManagerLeaveService).getManagerOwnedLeaveRequests();
};