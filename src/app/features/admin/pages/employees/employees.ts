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
import { DepartmentProjectionDTO } from '../../../../core/dtos/department/department.projection.dto';
import { RoleDTO } from '../../../../core/http/role/admin-role-api';
import { AdminUserService } from '../../services/user/admin-user.service';
import { NotificationService } from '../../../../shared/services/notification.service';

interface EmployeeStat {
  label: string;
  value: string;
  note: string;
}

type DialogMode = 'team' | 'role' | 'department' | null;

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
  departments: DepartmentProjectionDTO[] = [];
  roles: RoleDTO[] = [];
  employeeStats: EmployeeStat[] = [];
  isLoading = true;
  activeMenuRowId: number | null = null;
  dialogMode: DialogMode = null;
  selectedEmployee: UserProjectionDTO | null = null;

  readonly assignTeamForm = this.fb.group({
    teamId: this.fb.control<number | null>(null, Validators.required),
  });

  readonly assignRoleForm = this.fb.group({
    roleId: this.fb.control<number | null>(null, Validators.required),
  });

  readonly assignDepartmentForm = this.fb.group({
    departmentId: this.fb.control<number | null>(null, Validators.required),
  });

  ngOnInit(): void {
    this.employees = this.route.snapshot.data['employees'] ?? [];
    this.teams = this.route.snapshot.data['teams'] ?? [];
    this.departments = this.route.snapshot.data['departments'] ?? [];
    this.roles = this.route.snapshot.data['roles'] ?? [];
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

  getEmployeeActions(employee: UserProjectionDTO): readonly { id: string; label: string }[] {
    const actions: { id: string; label: string }[] = [
      { id: 'assign-role', label: 'Assign role' },
      { id: 'assign-department', label: 'Assign department' },
    ];
    if (employee.role === 'EMPLOYEE') {
      actions.push({ id: 'assign-team', label: 'Assign team' });
    }
    return actions;
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
    this.selectedEmployee = employee;
    this.activeMenuRowId = null;

    if (actionId === 'assign-team') {
      this.assignTeamForm.reset({ teamId: null });
      this.dialogMode = 'team';
    } else if (actionId === 'assign-role') {
      this.assignRoleForm.reset({ roleId: null });
      this.dialogMode = 'role';
    } else if (actionId === 'assign-department') {
      this.assignDepartmentForm.reset({ departmentId: null });
      this.dialogMode = 'department';
    }
  }

  closeDialog(): void {
    this.dialogMode = null;
    this.selectedEmployee = null;
  }

  submitAssignTeam(): void {
    if (!this.selectedEmployee || this.assignTeamForm.invalid) {
      this.assignTeamForm.markAllAsTouched();
      return;
    }

    const teamId = this.assignTeamForm.value.teamId as number;
    this.adminUserService.assignUserToTeam(this.selectedEmployee.id, teamId).subscribe({
      next: (updatedUser) => this.updateEmployee(updatedUser, 'Employee assigned to team.'),
    });
  }

  submitAssignRole(): void {
    if (!this.selectedEmployee || this.assignRoleForm.invalid) {
      this.assignRoleForm.markAllAsTouched();
      return;
    }

    const roleId = this.assignRoleForm.value.roleId as number;
    this.adminUserService.assignUserRole(this.selectedEmployee.id, roleId).subscribe({
      next: (updatedUser) =>
        this.updateEmployee(
          updatedUser,
          'Role updated. Leave balances were protected for role migration.',
        ),
    });
  }

  submitAssignDepartment(): void {
    if (!this.selectedEmployee || this.assignDepartmentForm.invalid) {
      this.assignDepartmentForm.markAllAsTouched();
      return;
    }

    const departmentId = this.assignDepartmentForm.value.departmentId as number;
    this.adminUserService
      .assignUserDepartment(this.selectedEmployee.id, departmentId)
      .subscribe({
        next: (updatedUser) => this.updateEmployee(updatedUser, 'Department assigned.'),
      });
  }

  private updateEmployee(updatedUser: UserProjectionDTO, message: string): void {
    this.employees = this.employees.map((employee) =>
      employee.id === updatedUser.id ? updatedUser : employee,
    );
    this.buildStats();
    this.closeDialog();
    this.notifications.showSuccess(message);
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