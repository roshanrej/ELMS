import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LeavePolicyProjectionDTO } from '../../../../core/dtos/leave-policy/leave-policy.projection.dto';
import { LeaveRequestProjectionDTO } from '../../../../core/dtos/leave-request/leave-request.projection.dto';
import { LeaveRequestActionEnum } from '../../../../core/types-enums/leave-request-action.enum';
import { LeaveService } from '../../services/leave-requests/leave-request.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-my-leaves',
  imports: [CommonModule, FormsModule, RouterLink, ConfirmDialog],
  templateUrl: './my-leaves.html',
  styleUrl: './my-leaves.scss',
})
export class MyLeavesPage implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly leaveService = inject(LeaveService);
  private readonly notifications = inject(NotificationService);

  readonly LeaveAction = LeaveRequestActionEnum;

  mode = 'submitted';

  employeeLeaves: LeaveRequestProjectionDTO[] = [];
  filteredLeaves: LeaveRequestProjectionDTO[] = [];
  leavePolicies: LeavePolicyProjectionDTO[] = [];

  selectedType: string | 'ALL' = 'ALL';
  selectedStatus: string | 'ALL' = 'ALL';
  selectedYear: number | 'ALL' = 'ALL';

  years: number[] = [];

  isLoading = signal(true);

  actionPending = new Map<number, LeaveRequestActionEnum | null>();

  confirmTarget: {
    leave: LeaveRequestProjectionDTO;
    action: LeaveRequestActionEnum;
  } | null = null;

  readonly actionMeta: Partial<Record<LeaveRequestActionEnum, {
    label: string;
    description: string;
    danger: boolean;
  }>> = {
    [LeaveRequestActionEnum.SUBMIT_REQUEST]: {
      label: 'Submit Request',
      description: 'This will submit your leave request for approval. You won\'t be able to edit it after submission.',
      danger: false,
    },
    [LeaveRequestActionEnum.REQUEST_CANCEL]: {
      label: 'Request Cancellation',
      description: 'This will send a cancellation request to your manager. The leave will remain active until it is approved.',
      danger: true,
    },
    [LeaveRequestActionEnum.CANCEL_REQUEST]: {
      label: 'Cancel Request',
      description: 'This will immediately cancel your pending leave request.',
      danger: true,
    },
    [LeaveRequestActionEnum.DELETE_DRAFT]: {
      label: 'Delete Draft',
      description: 'This will permanently delete this draft. This action cannot be undone.',
      danger: true,
    },
    [LeaveRequestActionEnum.EDIT_DRAFT]: {
      label: 'Edit Draft',
      description: '',
      danger: false,
    },
  };

  statusClassMap: Record<string, string> = {
    APPROVED: 'badge-soft-green',
    PENDING: 'badge-soft-yellow',
    REJECTED: 'badge-soft-red',
    CANCELLED: 'badge-soft-gray',
    DRAFT: 'badge-soft-gray',
    CANCEL_PENDING: 'badge-soft-orange',
  };

  statusLabelMap: Record<string, string> = {
    APPROVED: 'Approved',
    PENDING: 'Pending',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
    DRAFT: 'Draft',
    CANCEL_PENDING: 'Cancellation Requested',
  };
  get confirmMeta() {
  if (!this.confirmTarget) return null;
  return this.actionMeta[this.confirmTarget.action] ?? null;
}

  ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'] ?? 'submitted';
    this.leavePolicies = this.route.snapshot.data['leavePolicies'] ?? [];
    this.employeeLeaves = this.route.snapshot.data['leaves'] ?? [];

    this.extractYears();
    this.applyFilters();
    this.isLoading.set(false);
  }

  requestAction(
    leave: LeaveRequestProjectionDTO,
    action: LeaveRequestActionEnum
  ): void {
    if (action === LeaveRequestActionEnum.EDIT_DRAFT) {
      this.performAction(leave, action);
      return;
    }
    this.confirmTarget = { leave, action };
  }

  dismissConfirm(): void {
    this.confirmTarget = null;
  }

  async confirmAction(): Promise<void> {
    if (!this.confirmTarget) return;
    const { leave, action } = this.confirmTarget;
    this.confirmTarget = null;
    await this.performAction(leave, action);
  }

  isRowPending(leaveId: number): boolean {
    return this.actionPending.has(leaveId);
  }

  async performAction(
    leave: LeaveRequestProjectionDTO,
    action: LeaveRequestActionEnum
  ): Promise<void> {
    try {
      this.actionPending.set(leave.id, action);
      let updatedLeave: LeaveRequestProjectionDTO | null = null;

      switch (action) {

        case LeaveRequestActionEnum.SUBMIT_REQUEST:
          updatedLeave = await firstValueFrom(
            this.leaveService.submitExistingLeaveRequest(leave.id)
          );
          this.notifications.showSuccess('Leave request submitted successfully.');
          break;

        case LeaveRequestActionEnum.REQUEST_CANCEL:
          updatedLeave = await firstValueFrom(
            this.leaveService.requestLeaveCancellation(leave.id)
          );
          this.notifications.showSuccess('Cancellation request submitted.');
          break;

        case LeaveRequestActionEnum.CANCEL_REQUEST:
          updatedLeave = await firstValueFrom(
            this.leaveService.cancelLeaveRequest(leave.id)
          );
          this.notifications.showSuccess('Leave request cancelled.');
          break;

        case LeaveRequestActionEnum.DELETE_DRAFT:
          await firstValueFrom(
            this.leaveService.deleteLeaveDraft(leave.id)
          );
          this.employeeLeaves = this.employeeLeaves.filter(
            l => l.id !== leave.id
          );
          this.applyFilters();
          this.notifications.showSuccess('Draft deleted successfully.');
          return;

        case LeaveRequestActionEnum.EDIT_DRAFT:
          await this.router.navigate(
            ['/employee/leaves/apply'],
            {
              queryParams: { draftId: leave.id },
              state: { draft: leave },
            }
          );
          return;

        default:
          return;
      }

      if (updatedLeave) {
        this.employeeLeaves = this.employeeLeaves.map(
          l => l.id === updatedLeave!.id ? updatedLeave! : l
        );
        this.extractYears();
        this.applyFilters();
      }

    } catch {
    } finally {
      this.actionPending.delete(leave.id);
    }
  }

  applyFilters(): void {
    let filtered = [...this.employeeLeaves];

    if (this.selectedYear !== 'ALL') {
      filtered = filtered.filter(
        leave => new Date(leave.startDate).getFullYear() === this.selectedYear
      );
    }

    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(
        leave => leave.status === this.selectedStatus
      );
    }

    if (this.selectedType !== 'ALL') {
      filtered = filtered.filter(
        leave => leave.leaveType === this.selectedType
      );
    }

    this.filteredLeaves = filtered;
  }

  extractYears(): void {
    const years = new Set<number>();

    this.employeeLeaves.forEach(leave => {
      years.add(new Date(leave.startDate).getFullYear());
    });

    this.years = Array.from(years).sort((a, b) => b - a);
  }

  hasAction(
    leave: LeaveRequestProjectionDTO,
    action: LeaveRequestActionEnum
  ): boolean {
    return leave.allowedActions?.includes(action) ?? false;
  }

  getTypeLabel(type: string | null | undefined): string {
    if (!type) return '-';

    const policy = this.leavePolicies.find(
      p => p.leaveTypeName === type
    );

    return this.formatType(policy?.leaveTypeName ?? type);
  }

  formatType(type: string): string {
    return type
      .toLowerCase()
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  getStatusLabel(status: string): string {
    return this.statusLabelMap[status] ?? status;
  }

}
