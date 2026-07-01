import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthStore } from '../../../../auth/store/auth.store';
import { DepartmentProjectionDTO } from '../../../../core/dtos/department/department.projection.dto';
import { UserProjectionDTO } from '../../../../core/dtos/user/user-projection.dto';
import { RoleDTO } from '../../../../core/http/role/admin-role-api';
import { UserStatusEnum } from '../../../../core/types-enums/user-status.enum';
import { LeaveStatusBadge } from '../../../../shared/components/leave-status-badge/leave-status-badge';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { RowActionMenuComponent } from '../../../../shared/components/row-action-menu/row-action-menu';
import { NotificationService } from '../../../../shared/services/notification.service';
import { SuperAdminUserService } from '../../services/super-admin-user.service';

@Component({
  selector: 'app-super-admin-users',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeader,
    LeaveStatusBadge,
    LoadingSpinner,
    RowActionMenuComponent,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class SuperAdminUsersPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(SuperAdminUserService);
  private readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);

  users: UserProjectionDTO[] = [];
  departments: DepartmentProjectionDTO[] = [];
  roles: RoleDTO[] = [];
  isLoading = true;
  createDialogVisible = false;
  activeMenuRowId: number | null = null;

  readonly createForm = this.fb.group({
    name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    departmentId: this.fb.control<number | null>(null, Validators.required),
    roleId: this.fb.control<number | null>(null, Validators.required),
  });

  ngOnInit(): void {
    this.users = this.route.snapshot.data['users'] ?? [];
    this.departments = this.route.snapshot.data['departments'] ?? [];
    this.roles = this.route.snapshot.data['roles'] ?? [];
    this.isLoading = false;
  }

  get currentUserEmail(): string | undefined {
    return this.authStore.currentUser?.email;
  }
  

  formatLabel(value: string): string {
    return value
      .toLowerCase()
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  openCreateDialog(): void {
    this.createForm.reset({
      name: '',
      email: '',
      password: '',
      departmentId: null,
      roleId: null,
    });
    this.createDialogVisible = true;
  }

  closeCreateDialog(): void {
    this.createDialogVisible = false;
  }

  submitCreateUser(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const value = this.createForm.getRawValue();
    this.userService
      .createUser({
        name: value.name.trim(),
        email: value.email.trim(),
        password: value.password,
        departmentId: value.departmentId as number,
        roleId: value.roleId as number,
      })
      .subscribe({
        next: (created) => {
          this.users = [...this.users, created];
          this.closeCreateDialog();
          this.notifications.showSuccess('User created successfully.');
        },
      });
  }

  getUserActions(user: UserProjectionDTO): readonly { id: string; label: string }[] {
    if (user.status === UserStatusEnum.ACTIVE) {
      return [{ id: 'deactivate', label: 'Deactivate' }];
    }
    return [{ id: 'activate', label: 'Activate' }];
  }

  canManageUser(user: UserProjectionDTO): boolean {
    return user.role !== 'SUPER_ADMIN';
  }

  isRowMenuOpen(userId: number): boolean {
    return this.activeMenuRowId === userId;
  }

  onMenuToggle(userId: number, isOpen: boolean): void {
    this.activeMenuRowId = isOpen ? userId : null;
  }

  isMenuCloseRequested(userId: number): boolean {
    return this.activeMenuRowId !== null && this.activeMenuRowId !== userId;
  }

  onUserMenuAction(user: UserProjectionDTO, actionId: string): void {
    this.activeMenuRowId = null;
    if (actionId === 'activate') {
      this.userService.activateUser(user.id).subscribe({
        next: (updated) => this.replaceUser(updated, 'User activated.'),
      });
      return;
    }
    if (actionId === 'deactivate') {
      this.userService.deactivateUser(user.id).subscribe({
        next: (updated) => this.replaceUser(updated, 'User deactivated.'),
      });
    }
  }

  private replaceUser(updated: UserProjectionDTO, message: string): void {
    this.users = this.users.map((user) => (user.id === updated.id ? updated : user));
    this.notifications.showSuccess(message);
  }
}