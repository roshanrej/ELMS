import { LeaveRequestActionEnum } from '../../core/types-enums/leave-request-action.enum';

export interface LeaveRequestActionMeta {
  label: string;
  description: string;
  icon: string;
  danger: boolean;
  successMessage: string;
}

export const LEAVE_REQUEST_ACTION_META: Record<LeaveRequestActionEnum, LeaveRequestActionMeta> = {
  [LeaveRequestActionEnum.EDIT_DRAFT]: {
    label: 'Edit Draft',
    description: 'This will open the draft so you can update it before submission.',
    icon: 'bi-pencil',
    danger: false,
    successMessage: '',
  },
  [LeaveRequestActionEnum.DELETE_DRAFT]: {
    label: 'Delete Draft',
    description: 'This will permanently delete this draft. This action cannot be undone.',
    icon: 'bi-trash3',
    danger: true,
    successMessage: 'Draft deleted successfully.',
  },
  [LeaveRequestActionEnum.SAVE_DRAFT]: {
    label: 'Save Draft',
    description: 'This will save the leave request as a draft.',
    icon: 'bi-save',
    danger: false,
    successMessage: 'Draft saved successfully.',
  },
  [LeaveRequestActionEnum.SUBMIT_REQUEST]: {
    label: 'Submit Request',
    description: 'This will submit your leave request for approval. You will not be able to edit it after submission.',
    icon: 'bi-send-check',
    danger: false,
    successMessage: 'Leave request submitted successfully.',
  },
  [LeaveRequestActionEnum.CANCEL_REQUEST]: {
    label: 'Cancel Request',
    description: 'This will immediately cancel your pending leave request.',
    icon: 'bi-x-circle',
    danger: true,
    successMessage: 'Leave request cancelled.',
  },
  [LeaveRequestActionEnum.REQUEST_CANCEL]: {
    label: 'Request Cancellation',
    description: 'This will send a cancellation request to your manager. The leave will remain active until it is approved.',
    icon: 'bi-calendar-x',
    danger: true,
    successMessage: 'Cancellation request submitted.',
  },
  [LeaveRequestActionEnum.APPROVE_REQUEST]: {
    label: 'Approve Request',
    description: 'This will approve the leave request.',
    icon: 'bi-check-circle',
    danger: false,
    successMessage: 'Leave request approved.',
  },
  [LeaveRequestActionEnum.REJECT_REQUEST]: {
    label: 'Reject Request',
    description: 'This will reject the leave request.',
    icon: 'bi-x-octagon',
    danger: true,
    successMessage: 'Leave request rejected.',
  },
  [LeaveRequestActionEnum.APPROVE_CANCEL]: {
    label: 'Approve Cancellation',
    description: 'This will approve the employee cancellation request.',
    icon: 'bi-calendar-check',
    danger: false,
    successMessage: 'Cancellation approved.',
  },
  [LeaveRequestActionEnum.REJECT_CANCEL]: {
    label: 'Reject Cancellation',
    description: 'This will reject the employee cancellation request.',
    icon: 'bi-calendar2-x',
    danger: true,
    successMessage: 'Cancellation rejected.',
  },
};

export function getLeaveRequestActionMeta(action: LeaveRequestActionEnum): LeaveRequestActionMeta {
  return LEAVE_REQUEST_ACTION_META[action] ?? {
    label: formatLeaveRequestActionLabel(action),
    description: `This will run ${formatLeaveRequestActionLabel(action).toLowerCase()}.`,
    icon: 'bi-lightning-charge',
    danger: false,
    successMessage: `${formatLeaveRequestActionLabel(action)} completed.`,
  };
}

function formatLeaveRequestActionLabel(action: LeaveRequestActionEnum): string {
  return action
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
