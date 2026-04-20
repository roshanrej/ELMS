
import { LeaveTypeEnum } from "./leave-type-enum";
import { LeaveStatusEnum } from "./leave-status-enum";

 export interface LeaveModel {
  id: number;
  userId: number;
  leaveType: LeaveTypeEnum;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatusEnum;
  appliedAt: Date;
  // 🔥 NEW (decision layer)
  approverId?: number;        // who approved/rejected
  approverName?: string;      // UI-friendly
  decisionAt?: Date;          // when decision happened
  comments?: string;          // manager/admin remarks
}