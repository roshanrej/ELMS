
import { LeaveTypeEnum } from "../../types-enums/leave-type-enum";
import { LeaveStatusEnum } from "../../types-enums/leave-status-enum";

 export interface LeaveModel {
  id: number;


  leaveType: LeaveTypeEnum | null;

  startDate: Date;
  endDate: Date;

  reason: string;

  status: LeaveStatusEnum;

  createdAt: Date; // when draft or record was created

  // submission metadata
  approverId?: number;        // who approved/rejected
  approverName?: string;      // UI-friendly
  submittedAt?: Date;         // submission timestamp
  decisionAt?: Date;          // approval/rejection timestamp (if any)
            // manager/admin remarks
}