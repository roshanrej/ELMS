import {  ResolveFn } from "@angular/router";
import { ManagerDashboardProjectionDTO } from "../../../core/dtos/dashboard/manager-dashboard-projection.dto";
import { ManagerLeaveService } from "../services/leave-requests/manager-leave.service";
import { inject } from "@angular/core";
export const managerDashboardDetailsResolver : ResolveFn<ManagerDashboardProjectionDTO > = ()=>{
return inject(ManagerLeaveService).getManagerDashboardProjection();
}