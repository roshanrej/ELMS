import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

const STATUS_CLASS_MAP: Record<string, string> = {
  APPROVED: 'badge-soft-green',
  PENDING: 'badge-soft-yellow',
  REJECTED: 'badge-soft-red',
  CANCELLED: 'badge-soft-gray',
  DRAFT: 'badge-soft-gray',
  CANCEL_PENDING: 'badge-soft-orange',
  ACTIVE: 'badge-soft-green',
  INACTIVE: 'badge-soft-gray',
};

const STATUS_LABEL_MAP: Record<string, string> = {
  APPROVED: 'Approved',
  PENDING: 'Pending',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  DRAFT: 'Draft',
  CANCEL_PENDING: 'Cancel Pending',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

@Component({
  selector: 'app-leave-status-badge',
  imports: [CommonModule],
  templateUrl: './leave-status-badge.html',
  styleUrl: './leave-status-badge.scss',
})
export class LeaveStatusBadge {
  @Input({ required: true }) status: string = '';

  get cssClass(): string {
    return STATUS_CLASS_MAP[this.status] ?? 'badge-soft-gray';
  }

  get label(): string {
    return STATUS_LABEL_MAP[this.status] ?? this.status;
  }
}
