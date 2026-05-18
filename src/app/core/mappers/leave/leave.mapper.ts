import { LeaveModel } from '../../models/leave/leave-model';
import { LeaveStatusEnum } from '../../types-enums/leave-status-enum';
import { LeaveTypeEnum } from '../../types-enums/leave-type-enum';
import { LeaveBalanceModel } from '../../models/leave/leave-balance.model';
import { LeaveRequestModel } from '../../models/leave/leave-request.model';

export type LeaveDto = {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
  status: string;
  createdAt: string;
  submittedAt?: string;
  approverId?: number;
  approverName?: string;
  decisionAt?: string;
}

export type LeaveBalanceDto = {
  leaveType: string;
  allocated: number;
  used: number;
  remaining: number;
  carryForward?: number;
};

export type LeaveRequestDto = {
  leaveType: string | null;
  startDate: string | null;
  endDate: string | null;
  reason: string;
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
    obj.createdAt === undefined
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

  const match = Object.values(LeaveStatusEnum).find((status) => status === normalized);

  if (!match) {
    throw new Error(`Invalid leave status: ${value}`);
  }

  return match;
}

function toLeaveType(value: string): LeaveTypeEnum {
  console.log(value)
  if (!value) {
    throw new Error('Missing leave type');
  }

  const normalized = value.toUpperCase();

  const match = Object.values(LeaveTypeEnum).find((type) => type === normalized);

  if (!match) {
    throw new Error(`Invalid leave type: ${value}`);
  }

  return match;
}

export function mapLeaveDtoToModel(rawLeave: unknown): LeaveModel {
  const leave = assertLeaveDto(rawLeave); // 🔥 strict validation

  return {
    id: leave.id,
    leaveType: toLeaveType(leave.leaveType),
    startDate: toDate(leave.startDate, 'startDate'),
    endDate: toDate(leave.endDate, 'endDate'),
    reason: leave.reason ?? '',
    status: toLeaveStatus(leave.status),
    createdAt: toDate(leave.createdAt, 'createdAt'),
    submittedAt: toOptionalDate(leave.submittedAt ?? undefined),
    approverId: leave.approverId,
    approverName: leave.approverName,
    decisionAt: toOptionalDate(leave.decisionAt),
   
  };
}

export function mapLeaveRequestModelToDto(model: LeaveRequestModel): LeaveRequestDto {
  const toIsoOrNull = (value: Date | string | null): string | null => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
  };

  return {
    leaveType: model.leaveType,
    startDate: toIsoOrNull(model.startDate),
    endDate: toIsoOrNull(model.endDate),
    reason: model.reason,
  };
}

export function mapLeaveBalanceDtoToModel(raw: unknown): LeaveBalanceModel {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid leave balance object');
  }

  const obj = raw as any;
  if (obj.leaveType === undefined || obj.allocated === undefined || obj.used === undefined || obj.remaining === undefined) {
    throw new Error('LeaveBalanceDto missing required fields');
  }

  return {
    leaveType: toLeaveType(String(obj.leaveType)),
    allocated: Number(obj.allocated),
    used: Number(obj.used),
    remaining: Number(obj.remaining),
    carryForward: obj.carryForward === undefined ? undefined : Number(obj.carryForward),
  };
}
