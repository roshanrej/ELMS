import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { LeaveStatusBadge } from '../../../../shared/components/leave-status-badge/leave-status-badge';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { RowActionMenuComponent } from '../../../../shared/components/row-action-menu/row-action-menu';
import { UserProjectionDTO } from '../../../../core/dtos/user/user-projection.dto';
import { UserStatusEnum } from '../../../../core/types-enums/user-status.enum';
import { TeamDTO } from '../../../../core/dtos/team/team.model';
import { AdminUserService } from '../../services/user/admin-user.service';
import { NotificationService } from '../../../../shared/services/notification.service';

interface EmployeeStat {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-employees',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeader,
    LeaveStatusBadge,
    LoadingSpinner,
    RowActionMenuComponent,
  ],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class EmployeesPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly adminUserService = inject(AdminUserService);
  private readonly fb = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);

  employees: UserProjectionDTO[] = [];
  teams: TeamDTO[] = [];
  employeeStats: EmployeeStat[] = [];
  isLoading = true;
  activeMenuRowId: number | null = null;
  assignDialogVisible = false;
  selectedEmployee: UserProjectionDTO | null = null;

  readonly assignTeamForm = this.fb.group({
    teamId: this.fb.control<number | null>(null, Validators.required),
  });

  ngOnInit(): void {
    this.employees = this.route.snapshot.data['employees'] ?? [];
    this.teams = this.route.snapshot.data['teams'] ?? [];
    this.buildStats();
    this.isLoading = false;
  }

  formatLabel(value: string): string {
    return value
      .toLowerCase()
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  canAssignTeam(employee: UserProjectionDTO): boolean {
    return employee.role === 'EMPLOYEE';
  }

  getEmployeeActions(): readonly { id: string; label: string }[] {
    return [{ id: 'assign-team', label: 'Assign team' }];
  }

  isRowMenuOpen(employeeId: number): boolean {
    return this.activeMenuRowId === employeeId;
  }

  onMenuToggle(employeeId: number, isOpen: boolean): void {
    if (isOpen) {
      this.activeMenuRowId = employeeId;
      return;
    }

    if (this.activeMenuRowId === employeeId) {
      this.activeMenuRowId = null;
    }
  }

  isMenuCloseRequested(employeeId: number): boolean {
    return this.activeMenuRowId !== null && this.activeMenuRowId !== employeeId;
  }

  onEmployeeMenuAction(employee: UserProjectionDTO, actionId: string): void {
    if (actionId === 'assign-team') {
      this.openAssignTeamDialog(employee);
    }
  }

  openAssignTeamDialog(employee: UserProjectionDTO): void {
    this.selectedEmployee = employee;
    this.assignTeamForm.reset({ teamId: null });
    this.assignDialogVisible = true;
    this.activeMenuRowId = null;
  }

  closeAssignDialog(): void {
    this.assignDialogVisible = false;
    this.selectedEmployee = null;
  }

  submitAssignTeam(): void {
    if (!this.selectedEmployee || this.assignTeamForm.invalid) {
      this.assignTeamForm.markAllAsTouched();
      return;
    }

    const teamId = this.assignTeamForm.value.teamId as number;

    this.adminUserService.assignUserToTeam(this.selectedEmployee.id, teamId).subscribe({
      next: (updatedUser) => {
        this.employees = this.employees.map((employee) =>
          employee.id === updatedUser.id ? updatedUser : employee,
        );
        this.buildStats();
        this.closeAssignDialog();
        this.notifications.showSuccess('Employee assigned to team.');
      },
    });
  }

  private buildStats(): void {
    const activeCount = this.employees.filter((e) => e.status === UserStatusEnum.ACTIVE).length;
    const managerCount = this.employees.filter((e) => e.role === 'MANAGER').length;
    const employeeCount = this.employees.filter((e) => e.role === 'EMPLOYEE').length;

    this.employeeStats = [
      {
        label: 'Total Users',
        value: String(this.employees.length),
        note: 'All registered accounts in the system.',
      },
      {
        label: 'Active Users',
        value: String(activeCount),
        note: 'Users currently allowed to sign in.',
      },
      {
        label: 'Managers',
        value: String(managerCount),
        note: 'Users who can approve team leave requests.',
      },
      {
        label: 'Employees',
        value: String(employeeCount),
        note: 'Individual contributors requesting leave.',
      },
    ];
  }
}