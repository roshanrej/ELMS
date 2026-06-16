import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { LeavePolicyProjectionDTO } from '../../../../core/dtos/leave-policy/leave-policy.projection.dto';
import { LeaveTypeProjectionDTO } from '../../../../core/dtos/leave-type/leave-type.projection.dto';
import { LeaveStatusBadge } from '../../../../shared/components/leave-status-badge/leave-status-badge';
import { AdminLeavePolicyService } from '../../services/leave-policy/admin-leave-policy.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { LeaveTypeStatusEnum } from '../../../../core/types-enums/leave-type-status-enum';

@Component({
  selector: 'app-leave-quotas',
  imports: [CommonModule, ReactiveFormsModule, PageHeader, LoadingSpinner, LeaveStatusBadge],
  templateUrl: './leave-quotas.html',
  styleUrl: './leave-quotas.scss',
})
export class LeaveQuotasPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly policyService = inject(AdminLeavePolicyService);
  private readonly fb = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);

  policies: LeavePolicyProjectionDTO[] = [];
  leaveTypes: LeaveTypeProjectionDTO[] = [];
  policyYear = new Date().getFullYear();
  isLoading = true;
  createDialogVisible = false;

  readonly createPolicyForm = this.fb.group({
    leaveType: ['', Validators.required],
    allocatedLeave: [12, [Validators.required, Validators.min(1)]],
    noticePeriodDays: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.policies = this.route.snapshot.data['leavePolicies'] ?? [];
    this.leaveTypes = (this.route.snapshot.data['leaveTypes'] ?? []).filter(
      (type: LeaveTypeProjectionDTO) => type.status === LeaveTypeStatusEnum.ACTIVE,
    );
    this.isLoading = false;
  }

  openCreateDialog(): void {
    this.createPolicyForm.reset({
      leaveType: '',
      allocatedLeave: 12,
      noticePeriodDays: 0,
    });
    this.createDialogVisible = true;
  }

  closeCreateDialog(): void {
    this.createDialogVisible = false;
  }

  submitCreatePolicy(): void {
    if (this.createPolicyForm.invalid) {
      this.createPolicyForm.markAllAsTouched();
      return;
    }

    const value = this.createPolicyForm.getRawValue();

    this.policyService
      .createLeavePolicy({
        leaveType: value.leaveType!,
        year: this.policyYear,
        allocatedLeave: value.allocatedLeave!,
        noticePeriodDays: value.noticePeriodDays!,
      })
      .subscribe({
        next: (policy) => {
          this.policies = [policy, ...this.policies];
          this.closeCreateDialog();
          this.notifications.showSuccess('Leave policy created and balances initialized.');
        },
      });
  }

  formatType(type: string): string {
    return type
      .toLowerCase()
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}