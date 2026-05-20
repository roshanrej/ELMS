/**
 * Leave Action Constants
 * 
 * These are UI representations of actions the user can perform.
 * Backend determines which actions are valid based on:
 * - Current leave status
 * - User role and permissions
 * - Business workflow rules
 * 
 * Frontend should request available actions from backend API
 * rather than determining them locally based on status enum.
 */
export const LEAVE_ACTIONS = {
  CREATE_DRAFT : 'CREATE_DRAFT',
  EDIT_DRAFT: 'EDIT_DRAFT',
  DELETE_DRAFT: 'DELETE_DRAFT',
  SUBMIT: 'SUBMIT',
  CANCEL_LEAVE: 'CANCEL_LEAVE',
  REQUEST_CANCEL: 'REQUEST_CANCEL'
} as const;

export type LeaveActionType = typeof LEAVE_ACTIONS[keyof typeof LEAVE_ACTIONS];