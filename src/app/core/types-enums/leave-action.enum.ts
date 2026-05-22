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
   CANCEL_REQUEST:"CANCEL_REQUEST",
        DELETE_DRAFT:"DELETE_DRAFT",
        SAVE_DRAFT:"SAVE_DRAFT",
        SUBMIT_REQUEST:"SUBMIT_REQUEST",
        APPROVE_REQUEST:"APPROVE_REQUEST",
        REJECT_REQUEST:"REJECT_REQUEST",
        REQUEST_CANCEL:"REQUEST_CANCEL",
        APPROVE_CANCEL:"APPROVE_CANCEL",
        REJECT_CANCEL:"REJECT_CANCEL"
} as const;

export type LeaveActionType = typeof LEAVE_ACTIONS[keyof typeof LEAVE_ACTIONS];