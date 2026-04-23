import { LeaveTypeEnum } from "../../types-enums/leave-type-enum";
export interface LeaveBalanceModel {
  leaveType: LeaveTypeEnum;
  allocated: number;
  used: number;
  remaining: number;
  carryForward?: number;
}