import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ManagerEmployeeLeaveDTO } from '../../../../core/dtos/leave-request/manager-employee-leave.dto';
import { LeaveRequestProjectionDTO } from '../../../../core/dtos/leave-request/leave-request.projection.dto';
import { LeaveRequestActionEnum } from '../../../../core/types-enums/leave-request-action.enum';
import { ManagerLeaveService } from '../../services/leave-requests/manager-leave.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { LeaveActionMenuComponent } from '../../../../shared/components/leave-action-menu/leave-action-menu';
import { NotificationService } from '../../../../shared/services/notification.service';
import { getLeaveRequestActionMeta } from '../../../../shared/models/leave-request-action-menu.model';
import { LeaveStatusBadge } from '../../../../shared/components/leave-status-badge/leave-status-badge';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-team-leaves',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialog, LeaveActionMenuComponent, LeaveStatusBadge, PageHeader, LoadingSpinner],
  templateUrl: './team-leaves.html',
  styleUrl: './team-leaves.scss',
})
export class TeamLeavesPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly managerLeaveService = inject(ManagerLeaveService);
  private readonly notifications = inject(NotificationService);

  teamLeaves: ManagerEmployeeLeaveDTO[] = [];
  filteredTeamLeaves: ManagerEmployeeLeaveDTO[] = [];
  leaveTypes: string[] = [];

  selectedType: string | 'ALL' = 'ALL';
  selectedStatus: string | 'ALL' = 'ALL';
  selectedYear: number | 'ALL' = 'ALL';
  years: number[] = [];

  isLoading = signal(true);

  actionPending = new Map<number, LeaveRequestActionEnum | null>();

  confirmTarget: {
    leave: ManagerEmployeeLeaveDTO;
    action: LeaveRequestActionEnum;
  } | null = null;

  activeMenuRowId: number | null = null;

  // Status rendering delegated to shared LeaveStatusBadge (eliminates duplicate maps).

  ngOnInit(): void {
    this.teamLeaves = this.route.snapshot.data['teamLeaves'] ?? [];
    this.extractFilters();
    this.applyFilters();
    this.isLoading.set(false);
  }

  get confirmMeta() {
    if (!this.confirmTarget) return null;
    return getLeaveRequestActionMeta(this.confirmTarget.action);
  }

  async refreshLeaves(): Promise<void> {
    this.teamLeaves = await firstValueFrom(
      this.managerLeaveService.getManagerOwnedLeaveRequests(),
    );
    this.extractFilters();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.teamLeaves];

    if (this.selectedYear !== 'ALL') {
      filtered = filtered.filter(
        employeeLeave =>
          new Date(employeeLeave.leaveRequest.startDate).getFullYear() === this.selectedYear,
      );
    }

    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(
        employeeLeave => employeeLeave.leaveRequest.status === this.selectedStatus,
      );
    }

    if (this.selectedType !== 'ALL') {
      filtered = filtered.filter(
        employeeLeave => employeeLeave.leaveRequest.leaveType === this.selectedType,
      );
    }

    this.filteredTeamLeaves = filtered;
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

    this.teamLeaves.forEach(employeeLeave => {
      years.add(new Date(employeeLeave.leaveRequest.startDate).getFullYear());
      if (employeeLeave.leaveRequest.leaveType) {
        types.add(employeeLeave.leaveRequest.leaveType);
      }
    });

    this.years = Array.from(years).sort((a, b) => b - a);
    this.leaveTypes = Array.from(types).sort();
  }

  getAvailableActions(employeeLeave: ManagerEmployeeLeaveDTO): LeaveRequestActionEnum[] {
    return employeeLeave.leaveRequest.allowedActions ?? [];
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

  requestAction(
    leave: ManagerEmployeeLeaveDTO,
    action: LeaveRequestActionEnum,
  ): void {
    this.activeMenuRowId = null;
    this.confirmTarget = { leave, action };
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

  getRowPendingAction(leaveId: number): LeaveRequestActionEnum | null {
    return this.actionPending.get(leaveId) ?? null;
  }

  async performAction(
    leave: ManagerEmployeeLeaveDTO,
    action: LeaveRequestActionEnum,
  ): Promise<void> {
    const leaveId = leave.leaveRequest.id;

    if (this.actionPending.has(leaveId)) {
      return;
    }

    try {
      this.actionPending.set(leaveId, action);
      let updatedLeaveRequest: LeaveRequestProjectionDTO | null = null;

      switch (action) {
        case LeaveRequestActionEnum.APPROVE_REQUEST:
          updatedLeaveRequest = await firstValueFrom(
            this.managerLeaveService.approveLeaveRequest(leaveId),
          );
          break;

        case LeaveRequestActionEnum.APPROVE_CANCEL:
          updatedLeaveRequest = await firstValueFrom(
            this.managerLeaveService.approveLeaveCancel(leaveId),
          );
          break;

        case LeaveRequestActionEnum.REJECT_CANCEL:
          updatedLeaveRequest = await firstValueFrom(
            this.managerLeaveService.rejectLeaveCancel(leaveId),
          );
          break;

        case LeaveRequestActionEnum.REJECT_REQUEST:
          updatedLeaveRequest = await firstValueFrom(
            this.managerLeaveService.rejectLeaveRequest(leaveId),
          );
          break;

        default:
          this.notifications.showError(
            `${getLeaveRequestActionMeta(action).label} is not available in this view yet.`,
          );
          return;
      }

      if (updatedLeaveRequest) {
        this.updateTeamLeavePayload(updatedLeaveRequest);
        this.notifications.showSuccess(getLeaveRequestActionMeta(action).successMessage);
      }
    } catch {
      // ManagerLeaveService already surfaces API errors via NotificationService.
    } finally {
      this.actionPending.delete(leaveId);
    }
  }

  private updateTeamLeavePayload(updatedLeaveRequest: LeaveRequestProjectionDTO): void {
    this.teamLeaves = this.teamLeaves.map(employeeLeave =>
      employeeLeave.leaveRequest.id === updatedLeaveRequest.id
        ? { ...employeeLeave, leaveRequest: updatedLeaveRequest }
        : employeeLeave,
    );
    this.applyFilters();
  }
}
