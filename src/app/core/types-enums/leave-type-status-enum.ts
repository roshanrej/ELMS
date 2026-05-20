/**
 * Leave Type Status Constants
 * 
 * These are UI representations of leave type status.
 * Backend is the source of truth for which leave types are active.
 * Use backend API response to determine whether a leave type is available.
 */
export const LEAVE_TYPE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
} as const;

export type LeaveTypeStatusType = typeof LEAVE_TYPE_STATUS[keyof typeof LEAVE_TYPE_STATUS];