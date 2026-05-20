/**
 * Leave Status Constants
 * 
 * These are UI representations of backend-owned status values.
 * Backend is the source of truth for valid status transitions and meanings.
 * Frontend should not filter or make decisions based on these values.
 * Use backend APIs that return pre-filtered data instead.
 */
export const LEAVE_STATUS = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  PENDING: 'PENDING',
  DRAFT: 'DRAFT',
  CANCEL_REQUESTED: 'CANCEL_REQUESTED'
} as const;

export type LeaveStatusType = typeof LEAVE_STATUS[keyof typeof LEAVE_STATUS];
