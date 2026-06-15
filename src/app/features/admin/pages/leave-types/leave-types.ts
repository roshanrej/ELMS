import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminLeaveTypeService } from '../../services/leave-type/admin-leave-type.service';
import { LeaveTypeProjectionDTO } from '../../../../core/dtos/leave-type/leave-type.projection.dto';
import { RowActionMenuComponent } from '../../../../shared/components/row-action-menu/row-action-menu';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { LeaveStatusBadge } from '../../../../shared/components/leave-status-badge/leave-status-badge';
import { NotificationService } from '../../../../shared/services/notification.service';
import { LeaveTypeStatusEnum } from '../../../../core/types-enums/leave-type-status-enum';
import { CreateLeaveTypeDTO } from '../../../../core/dtos/leave-type/create-leave-type.dto';
import { RenameLeaveTypeDTO } from '../../../../core/dtos/leave-type/rename-leave-type.dto';
import { UpdateLeaveTypeStatusDTO } from '../../../../core/dtos/leave-type/update-leave-type-status.dto';

@Component({
  selector: 'app-leave-types',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RowActionMenuComponent,
    PageHeader,
    ConfirmDialog,
    LoadingSpinner,
    LeaveStatusBadge,
  ],
  templateUrl: './leave-types.html',
  styleUrl: './leave-types.scss',
})
export class LeaveTypesPage implements OnInit {
  private readonly adminLeaveTypeService = inject(AdminLeaveTypeService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);

  leaveTypes: LeaveTypeProjectionDTO[] = [];
  filteredLeaveTypes: LeaveTypeProjectionDTO[] = [];
  activeMenuRowId: number | null = null;
  selectedLeaveType: LeaveTypeProjectionDTO | null = null;
  isLoading = false;

  createDialogVisible = false;
  renameDialogVisible = false;
  statusConfirmTarget: {
    leaveType: LeaveTypeProjectionDTO;
    newStatus: LeaveTypeStatusEnum;
  } | null = null;

  leaveTypeSearch = '';

  readonly createForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/\S/)]],
  });

  readonly renameForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/\S/)]],
  });

  get totalCount(): number {
    return this.leaveTypes.length;
  }

  get activeCount(): number {
    return this.leaveTypes.filter((lt) => lt.status === LeaveTypeStatusEnum.ACTIVE).length;
  }

  get inactiveCount(): number {
    return this.leaveTypes.filter((lt) => lt.status === LeaveTypeStatusEnum.INACTIVE).length;
  }

  ngOnInit(): void {
    this.leaveTypes = this.route.snapshot.data['leaveTypes'] ?? [];
    this.filteredLeaveTypes = this.filterList(this.leaveTypeSearch);
  }

  search(value: string): void {
    this.leaveTypeSearch = value;
    this.filteredLeaveTypes = this.filterList(value);
  }

  openCreateDialog(): void {
    this.closeDialogs();
    this.createForm.reset({ name: '' });
    this.createDialogVisible = true;
  }

  openRenameDialog(leaveType: LeaveTypeProjectionDTO): void {
    this.closeDialogs();
    this.selectedLeaveType = leaveType;
    this.renameForm.reset({ name: leaveType.leaveTypeName });
    this.renameDialogVisible = true;
  }

  submitCreate(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const name = this.createForm.value.name?.trim() ?? '';
    if (!name) return;

    const dto: CreateLeaveTypeDTO = { name };

    this.adminLeaveTypeService.createLeaveType(dto).subscribe({
      next: (created) => {
        const projection: LeaveTypeProjectionDTO = {
          id: created.id,
          leaveTypeName: created.name,
          status: created.status,
        };
        this.leaveTypes = [projection, ...this.leaveTypes];
        this.filteredLeaveTypes = this.filterList(this.leaveTypeSearch);
        this.closeDialogs();
        this.notifications.showSuccess('Leave type created successfully.');
      },
    });
  }

  submitRename(): void {
    if (!this.selectedLeaveType || this.renameForm.invalid) {
      this.renameForm.markAllAsTouched();
      return;
    }

    const newName = this.renameForm.value.name?.trim() ?? '';
    if (!newName) return;

    const dto: RenameLeaveTypeDTO = { leaveTypeName: newName };

    this.adminLeaveTypeService
      .rename(this.selectedLeaveType.id, dto)
      .subscribe({
        next: (updated) => {
          this.leaveTypes = this.leaveTypes.map((lt) =>
            lt.id === updated.id ? updated : lt
          );
          this.filteredLeaveTypes = this.filterList(this.leaveTypeSearch);
          this.closeDialogs();
          this.notifications.showSuccess('Leave type renamed successfully.');
        },
      });
  }

  requestStatusChange(leaveType: LeaveTypeProjectionDTO): void {
    const newStatus =
      leaveType.status === LeaveTypeStatusEnum.ACTIVE
        ? LeaveTypeStatusEnum.INACTIVE
        : LeaveTypeStatusEnum.ACTIVE;

    this.statusConfirmTarget = { leaveType, newStatus };
  }

  dismissStatusConfirm(): void {
    this.statusConfirmTarget = null;
  }

  confirmStatusChange(): void {
    if (!this.statusConfirmTarget) return;

    const { leaveType, newStatus } = this.statusConfirmTarget;
    this.statusConfirmTarget = null;

    const dto: UpdateLeaveTypeStatusDTO = { status: newStatus };

    this.adminLeaveTypeService.updateStatus(leaveType.id, dto).subscribe({
      next: (updated) => {
        this.leaveTypes = this.leaveTypes.map((lt) =>
          lt.id === updated.id ? updated : lt
        );
        this.filteredLeaveTypes = this.filterList(this.leaveTypeSearch);
        const label = newStatus === LeaveTypeStatusEnum.ACTIVE ? 'activated' : 'deactivated';
        this.notifications.showSuccess(`Leave type ${label} successfully.`);
      },
    });
  }

  isRowMenuOpen(leaveTypeId: number): boolean {
    return this.activeMenuRowId === leaveTypeId;
  }

  onMenuToggle(leaveTypeId: number, isOpen: boolean): void {
    this.activeMenuRowId = isOpen ? leaveTypeId : null;
  }

  closeDialogs(): void {
    this.createDialogVisible = false;
    this.renameDialogVisible = false;
    this.activeMenuRowId = null;
    this.selectedLeaveType = null;
  }

  getRowActions(leaveType: LeaveTypeProjectionDTO): readonly { id: string; label: string; danger?: boolean }[] {
    const isActive = leaveType.status === LeaveTypeStatusEnum.ACTIVE;
    return [
      { id: 'rename', label: 'Rename' },
      { 
        id: isActive ? 'deactivate' : 'activate', 
        label: isActive ? 'Deactivate' : 'Activate',
        danger: isActive 
      },
    ];
  }

  onMenuAction(leaveType: LeaveTypeProjectionDTO, actionId: string): void {
    this.activeMenuRowId = null;

    if (actionId === 'rename') {
      this.openRenameDialog(leaveType);
    } else if (actionId === 'activate' || actionId === 'deactivate') {
      this.requestStatusChange(leaveType);
    }
  }

  onMenuState(leaveTypeId: number, isOpen: boolean): void {
    this.onMenuToggle(leaveTypeId, isOpen);
  }

  private filterList(query: string): LeaveTypeProjectionDTO[] {
    const term = query.trim().toLowerCase();
    if (!term) return [...this.leaveTypes];
    return this.leaveTypes.filter((lt) =>
      lt.leaveTypeName.toLowerCase().includes(term)
    );
  }

  getStatusLabel(status: LeaveTypeStatusEnum): string {
    return status === LeaveTypeStatusEnum.ACTIVE ? 'Active' : 'Inactive';
  }
}
