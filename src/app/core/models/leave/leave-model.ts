



 export interface LeaveModel {
  id: number;
  leaveType: string;
  startDate:string;
  endDate: string;
  reason: string;
  status: string;
  createdAt: string; // when draft or record was created
  // submission metadata
  approverId?: number;        // who approved/rejected
  approverName?: string;      // UI-friendly
  submittedAt?: string;         // submission timestamp
  decisionAt?: string;          // approval/rejection timestamp (if any)
            // manager/admin remarks
}