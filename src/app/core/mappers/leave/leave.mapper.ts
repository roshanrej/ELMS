import { LeaveModel } from '../../models/leave/leave-model';
import { LeaveStatusEnum } from '../../types-enums/leave-status-enum';

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
 
};

export type LeaveRequestDto = {
  leaveType: string | null;
  startDate: string | null;
  endDate: string | null;
  reason: string ;
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


export function mapLeaveDtoToModel(rawLeave: unknown): LeaveModel {
  const leave = assertLeaveDto(rawLeave); // 🔥 strict validation

  return {
    id: leave.id,
    leaveType: leave.leaveType,
    startDate: leave.startDate,
    endDate: leave.endDate,
    reason: leave.reason ?? '',
    status: toLeaveStatus(leave.status),
    createdAt: leave.createdAt,
    submittedAt: leave.submittedAt ?? undefined,
    approverId: leave.approverId,
    approverName: leave.approverName,
    decisionAt: leave.decisionAt,
   
  };
}

export function mapLeaveRequestModelToDto(model: LeaveRequestModel): LeaveRequestDto {
  const toDateStringOrNull = (value: string | null): string | null => {
    if (!value) return null;
    return value;
  };

  return {
    leaveType: model.leaveType,
    startDate: toDateStringOrNull(model.startDate),
    endDate: toDateStringOrNull(model.endDate),
    reason: model.reason ?? '',
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
    leaveType:obj.leaveType,
    allocated: Number(obj.allocated),
    used: Number(obj.used),
    remaining: Number(obj.remaining),
    
  };
}
function toOptionalDate(dateString: string | undefined): Date | undefined {
  if (!dateString) {
    return undefined;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date;
}

function toDate(dateString: string, fieldName: string): Date {
  if (!dateString) {
    throw new Error(`Missing ${fieldName}`);
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format for ${fieldName}: ${dateString}`);
  }
  return date;
}

