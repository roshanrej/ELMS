import { LeaveRequestProjectionDTO } from "./leave-request.projection.dto";

export interface ManagerEmployeeLeaveDTO {
  leaveRequest: LeaveRequestProjectionDTO;
  employeeEmail: string;
  employeeName: string;
}
