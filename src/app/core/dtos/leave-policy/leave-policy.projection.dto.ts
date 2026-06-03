import { LeaveTypeStatusEnum } from "../../types-enums/leave-type-status-enum";

export interface LeavePolicyProjectionDTO {
  leaveTypeName: string;
  status: LeaveTypeStatusEnum;
  allocatedLeave: number;
  year: number;
}