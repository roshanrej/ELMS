import { LeaveModel } from '../models/leave-model';
import { LeaveStatusEnum } from '../models/leave-status-enum';
import { LeaveTypeEnum } from '../models/leave-type-enum';

export type LeaveDto = {
  id?: number | string;
  user_id?: number | string;
  leave_type?: string;
  start_date?: string | Date;
  end_date?: string | Date;
  reason?: string;
  status?: string;
  applied_at?: string | Date;
  approver_id?: number | string;
  approver_name?: string;
  decision_at?: string | Date;
  comments?: string;
};

export function mapLeaveDtoToModel(rawLeave: unknown): LeaveModel {
  const leave = asLeaveDto(rawLeave);

  return {
    id: toNumber(leave.id),
    userId: toNumber(leave.user_id),
    leaveType: toLeaveType(leave.leave_type),
    startDate: toDate(leave.start_date),
    endDate: toDate(leave.end_date),
    reason: leave.reason ?? '',
    status: toLeaveStatus(leave.status),
    appliedAt: toDate(leave.applied_at),
    approverId: toOptionalNumber(leave.approver_id),
    approverName: leave.approver_name,
    decisionAt: toOptionalDate(leave.decision_at),
    comments: leave.comments,
  };
}

function asLeaveDto(rawLeave: unknown): LeaveDto {
  if (rawLeave && typeof rawLeave === 'object') {
    return rawLeave as LeaveDto;
  }

  return {};
}

function toNumber(value: number | string | undefined): number {
  const converted = Number(value);
  return Number.isFinite(converted) ? converted : 0;
}

function toOptionalNumber(value: number | string | undefined): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const converted = Number(value);
  return Number.isFinite(converted) ? converted : undefined;
}

function toDate(value: string | Date | undefined): Date {
  if (value instanceof Date) {
    return value;
  }

  const converted = value ? new Date(value) : new Date();
  return Number.isNaN(converted.getTime()) ? new Date() : converted;
}

function toOptionalDate(value: string | Date | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const converted = value instanceof Date ? value : new Date(value);
  return Number.isNaN(converted.getTime()) ? undefined : converted;
}

function toLeaveType(value: string | undefined): LeaveTypeEnum {
  const normalizedValue = value?.toUpperCase();
  const leaveTypes = Object.values(LeaveTypeEnum);

  return leaveTypes.find(type => type === normalizedValue) ?? LeaveTypeEnum.Annual;
}

function toLeaveStatus(value: string | undefined): LeaveStatusEnum {
  const normalizedValue = value?.toUpperCase();
  const leaveStatuses = Object.values(LeaveStatusEnum);

  return leaveStatuses.find(status => status === normalizedValue) ?? LeaveStatusEnum.Pending;
}
