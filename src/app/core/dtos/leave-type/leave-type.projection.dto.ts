import { LeaveTypeStatusEnum } from '../../types-enums/leave-type-status-enum';

export interface LeaveTypeProjectionDTO {
  id: number;
  leaveTypeName: string;
  status: LeaveTypeStatusEnum;
}