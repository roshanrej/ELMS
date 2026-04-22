import { LeaveModel } from '../../models/leave/leave-model';
import { LeaveStatusEnum } from '../../types-enums/leave-status-enum';
import { LeaveTypeEnum } from '../../types-enums/leave-type-enum';

export type LeaveDto = {
  id: number;
  userId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
  status: string;
  appliedAt: string;
  approverId?: number;
  approverName?: string;
  decisionAt?: string;
  comments?: string;
};


function assertLeaveDto(raw: unknown): LeaveDto {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid leave object');
  }

  const obj = raw as any;

  // 🔥 Enforce camelCase keys explicitly
  if (
    obj.startDate === undefined ||
    obj.endDate === undefined ||
    obj.leaveType === undefined ||
    obj.status === undefined ||
    obj.appliedAt === undefined
  ) {
    throw new Error('LeaveDto missing required  fields');
  }

  return obj as LeaveDto;
}
function toDate(value: string | Date, field: string): Date {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ${field}`);
  }

  return date;
}

function toOptionalDate(value?: string | Date): Date | undefined {
  if (!value) return undefined;

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid optional date');
  }

  return date;
}

  function toLeaveStatus(value: string): LeaveStatusEnum {
  if (!value) {
    throw new Error('Missing leave status');
  }

  const normalized = value.toUpperCase();

  const match = Object.values(LeaveStatusEnum).find(
    status => status === normalized
  );

  if (!match) {
    throw new Error(`Invalid leave status: ${value}`);
  }

  return match;
}

function toLeaveType(value: string): LeaveTypeEnum {
  if (!value) {
    throw new Error('Missing leave type');
  }

  const normalized = value.toUpperCase();

  const match = Object.values(LeaveTypeEnum).find(
    type => type === normalized
  );

  if (!match) {
    throw new Error(`Invalid leave type: ${value}`);
  }

  return match;
}



export function mapLeaveDtoToModel(rawLeave: unknown): LeaveModel {
  const leave = assertLeaveDto(rawLeave); // 🔥 strict validation

  return {
    id: leave.id,
    userId: leave.userId,
    leaveType: toLeaveType(leave.leaveType),
    startDate: toDate(leave.startDate, 'startDate'),
    endDate: toDate(leave.endDate, 'endDate'),
    reason: leave.reason ?? '',
    status: toLeaveStatus(leave.status),
    appliedAt: toDate(leave.appliedAt, 'appliedAt'),
    approverId: leave.approverId,
    approverName: leave.approverName,
    decisionAt: toOptionalDate(leave.decisionAt),
    comments: leave.comments,
  };
}