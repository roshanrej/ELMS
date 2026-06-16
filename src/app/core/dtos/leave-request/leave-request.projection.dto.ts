import { LeaveRequestActionEnum } from "../../types-enums/leave-request-action.enum";
import { LeaveRequestStatusEnum } from "../../types-enums/leave-request-status-enum";

export interface LeaveRequestProjectionDTO {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  year : number;
  noOfDays: number;
  reason: string;
  status: LeaveRequestStatusEnum;
  createdAt: string;
  submittedAt: string | null;
  allowedActions?: LeaveRequestActionEnum[];
}
