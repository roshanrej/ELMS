import { ManagerDashboardLeaveProjectionDTO } from "../leave-request/manager-dashboard-leave-projection.dto";

export interface ManagerDashboardProjectionDTO  {
 upcomingLeaves : ManagerDashboardLeaveProjectionDTO[],
 pendingCount : number,
 pendingCancelCount : number
}