import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { DepartmentProjectionDTO } from '../../../../core/dtos/department/department.projection.dto';
import { DepartmentStatusEnum } from '../../../../core/types-enums/department-status.enum';
import { AdminDepartmentService } from '../../services/department/admin-department.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-departments',
  imports: [CommonModule, ReactiveFormsModule, PageHeader, LoadingSpinner],
  templateUrl: './departments.html',
  styleUrl: './departments.scss',
})
export class DepartmentsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly departmentService = inject(AdminDepartmentService);
  private readonly notifications = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  departments: DepartmentProjectionDTO[] = [];
  isLoading = true;
  createDialogVisible = false;
  renameDialogVisible = false;
  selectedDepartment: DepartmentProjectionDTO | null = null;

  readonly createForm = this.fb.group({
    name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly renameForm = this.fb.group({
    name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.departments = this.route.snapshot.data['departments'] ?? [];
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

  openCreateDialog(): void {
    this.createForm.reset({ name: '' });
    this.createDialogVisible = true;
  }

  closeCreateDialog(): void {
    this.createDialogVisible = false;
  }

  submitCreate(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const name = this.createForm.value.name!.trim();
    this.departmentService.createDepartment(name).subscribe({
      next: (created) => {
        this.departments = [...this.departments, created];
        this.closeCreateDialog();
        this.notifications.showSuccess('Department created.');
      },
    });
  }

  openRenameDialog(department: DepartmentProjectionDTO): void {
    this.selectedDepartment = department;
    this.renameForm.reset({ name: department.name });
    this.renameDialogVisible = true;
  }

  closeRenameDialog(): void {
    this.renameDialogVisible = false;
    this.selectedDepartment = null;
  }

  submitRename(): void {
    if (!this.selectedDepartment || this.renameForm.invalid) {
      this.renameForm.markAllAsTouched();
      return;
    }

    const name = this.renameForm.value.name!.trim();
    this.departmentService.renameDepartment(this.selectedDepartment.id, name).subscribe({
      next: (updated) => {
        this.departments = this.departments.map((dept) =>
          dept.id === updated.id ? updated : dept,
        );
        this.closeRenameDialog();
        this.notifications.showSuccess('Department renamed.');
      },
    });
  }

  toggleStatus(department: DepartmentProjectionDTO): void {
    const nextStatus =
      department.status === DepartmentStatusEnum.ACTIVE
        ? DepartmentStatusEnum.INACTIVE
        : DepartmentStatusEnum.ACTIVE;

    this.departmentService.updateDepartmentStatus(department.id, nextStatus).subscribe({
      next: (updated) => {
        this.departments = this.departments.map((dept) =>
          dept.id === updated.id ? updated : dept,
        );
        this.notifications.showSuccess('Department status updated.');
      },
    });
  }
}