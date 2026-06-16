import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LeaveRequestProjectionDTO } from '../../../../core/dtos/leave-request/leave-request.projection.dto';
import { LeaveRequestActionEnum } from '../../../../core/types-enums/leave-request-action.enum';
import { LeaveService } from '../../services/leave-requests/leave-request.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../../shared/services/notification.service';
import { LeaveActionMenuComponent } from '../../../../shared/components/leave-action-menu/leave-action-menu';
import { getLeaveRequestActionMeta } from '../../../../shared/models/leave-request-action-menu.model';
import { LeaveStatusBadge } from '../../../../shared/components/leave-status-badge/leave-status-badge';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-my-leaves',
  imports: [CommonModule, FormsModule, RouterLink, ConfirmDialog, LeaveActionMenuComponent, LeaveStatusBadge, PageHeader, LoadingSpinner],
  templateUrl: './my-leaves.html',
  styleUrl: './my-leaves.scss',
})
export class MyLeavesPage implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly leaveService = inject(LeaveService);
  private readonly notifications = inject(NotificationService);

  mode = 'submitted';

  employeeLeaves: LeaveRequestProjectionDTO[] = [];
  filteredLeaves: LeaveRequestProjectionDTO[] = [];
  leaveTypes: string[] = [];

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

  activeMenuRowId: number | null = null;

  // Status rendering is now handled by shared LeaveStatusBadge component.
  // Local maps removed to eliminate duplication.
  get confirmMeta() {
    if (!this.confirmTarget) return null;
    return getLeaveRequestActionMeta(this.confirmTarget.action);
  }

  ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'] ?? 'submitted';
    this.employeeLeaves = this.route.snapshot.data['leaves'] ?? [];

    this.extractFilters();
    this.applyFilters();
    this.isLoading.set(false);
  }

  requestAction(
    leave: LeaveRequestProjectionDTO,
    action: LeaveRequestActionEnum
  ): void {
    if (action === LeaveRequestActionEnum.EDIT_DRAFT) {
      void this.performAction(leave, action);
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

  isRowMenuOpen(leaveId: number): boolean {
    return this.activeMenuRowId === leaveId;
  }

  onMenuToggle(leaveId: number, isOpen: boolean): void {
    if (isOpen) {
      this.activeMenuRowId = leaveId;
      return;
    }

    if (this.activeMenuRowId === leaveId) {
      this.activeMenuRowId = null;
    }
  }

  isMenuCloseRequested(leaveId: number): boolean {
    return this.activeMenuRowId !== null && this.activeMenuRowId !== leaveId;
  }

  getRowPendingAction(leaveId: number): LeaveRequestActionEnum | null {
    return this.actionPending.get(leaveId) ?? null;
  }

  async performAction(
    leave: LeaveRequestProjectionDTO,
    action: LeaveRequestActionEnum
  ): Promise<void> {
    if (this.actionPending.has(leave.id)) {
      return;
    }

    try {
      this.actionPending.set(leave.id, action);

      let updatedLeave: LeaveRequestProjectionDTO | null = null;

      switch (action) {

        case LeaveRequestActionEnum.SUBMIT_REQUEST:
          updatedLeave = await firstValueFrom(
            this.leaveService.submitExistingLeaveRequest(leave.id)
          );
          break;

        case LeaveRequestActionEnum.REQUEST_CANCEL:
          updatedLeave = await firstValueFrom(
            this.leaveService.requestLeaveCancellation(leave.id)
          );
          break;

        case LeaveRequestActionEnum.CANCEL_REQUEST:
          updatedLeave = await firstValueFrom(
            this.leaveService.cancelLeaveRequest(leave.id)
          );
          break;

        case LeaveRequestActionEnum.DELETE_DRAFT:
          await firstValueFrom(
            this.leaveService.deleteLeaveDraft(leave.id)
          );
          this.employeeLeaves = this.employeeLeaves.filter((item) => item.id !== leave.id);
          this.extractFilters();
          this.applyFilters();
          this.notifications.showSuccess(getLeaveRequestActionMeta(action).successMessage);
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
          this.notifications.showError(`${getLeaveRequestActionMeta(action).label} is not available in this view yet.`);
          return;
      }

      if (updatedLeave) {
        this.updateLeavePayload(updatedLeave);
        this.notifications.showSuccess(getLeaveRequestActionMeta(action).successMessage);
      }

    } catch {
      // LeaveService already surfaces API errors via NotificationService.
    } finally {
      this.actionPending.delete(leave.id);
    }
  }

  async refreshLeaves(): Promise<void> {
    this.employeeLeaves = await firstValueFrom(
      this.mode === 'draft'
        ? this.leaveService.getEmployeeLeaveDrafts()
        : this.leaveService.getEmployeeLeaveRequestsProjections()
    );
    this.extractFilters();
    this.applyFilters();
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

  resetFilters(): void {
    this.selectedYear = 'ALL';
    this.selectedStatus = 'ALL';
    this.selectedType = 'ALL';
    this.applyFilters();
  }

  extractFilters(): void {
    const years = new Set<number>();
    const types = new Set<string>();

    this.employeeLeaves.forEach((leave) => {
      years.add(new Date(leave.startDate).getFullYear());
      if (leave.leaveType) {
        types.add(leave.leaveType);
      }
    });

    this.years = Array.from(years).sort((a, b) => b - a);
    this.leaveTypes = Array.from(types).sort();
  }

  private updateLeavePayload(updatedLeave: LeaveRequestProjectionDTO): void {
    this.employeeLeaves = this.employeeLeaves.map((leave) =>
      leave.id === updatedLeave.id ? updatedLeave : leave,
    );
    this.extractFilters();
    this.applyFilters();
  }

  getAvailableActions(leave: LeaveRequestProjectionDTO): LeaveRequestActionEnum[] {
    return leave.allowedActions ?? [];
  }

  getTypeLabel(type: string | null | undefined): string {
    if (!type) return '-';
    return this.formatType(type);
  }

  formatType(type: string): string {
    return type
      .toLowerCase()
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

}
