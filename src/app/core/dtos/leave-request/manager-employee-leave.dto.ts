import { LeaveRequestProjectionDTO } from "./leave-request.projection.dto";

export interface ManagerEmployeeLeaveDTO {
  leaveRequests: LeaveRequestProjectionDTO[];
  employeeEmail: string;
  employeeName: string;
}
