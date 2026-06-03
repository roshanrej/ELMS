 import { LeaveRequestStatusEnum } from "../../types-enums/leave-request-status-enum";
export  interface EmployeeLeaveRequestDTO {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  submittedAt: string | null;
  noOfDays: number;
  status: LeaveRequestStatusEnum;
}