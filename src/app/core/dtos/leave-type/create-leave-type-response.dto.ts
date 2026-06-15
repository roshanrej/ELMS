import { LeaveTypeStatusEnum } from '../../types-enums/leave-type-status-enum';

export interface CreateLeaveTypeResponseDTO {
  id: number;
  name: string;
  status: LeaveTypeStatusEnum;
}