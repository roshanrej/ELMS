import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { switchMap } from 'rxjs';
import { LeaveService } from '../../services/leave-requests/leave-request.service';
import { LeavePolicyProjectionDTO } from '../../../../core/dtos/leave-policy/leave-policy.projection.dto';
import { LeaveBalanceProjectionDTO } from '../../../../core/dtos/leave-balance/leave-balance.projection.dto';
import { LeaveRequestProjectionDTO } from '../../../../core/dtos/leave-request/leave-request.projection.dto';
import { CreateLeaveRequestDTO } from '../../../../core/dtos/leave-request/create-leave-request.dto';
import { NotificationService } from '../../../../shared/services/notification.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

/**
 * ARCHITECTURAL NOTE:
 * This component handles leave request form submission.
 * Business logic (calculating used days, validating against policy) is owned by backend.
 * Backend provides LeaveBalanceModel with pre-calculated metrics.
 */
@Component({
  selector: 'app-apply-leave',
  imports: [CommonModule, ReactiveFormsModule, PageHeader],
  templateUrl: './apply-leave.html',
  styleUrl: './apply-leave.scss',
})
export class ApplyLeavePage implements OnInit {
  
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private leaveRequestService = inject(LeaveService);
  private notifications = inject(NotificationService);

  leavePolicies: LeavePolicyProjectionDTO[] = [];
  leaveBalances: LeaveBalanceProjectionDTO[] = [];
  appliedLeave: LeaveRequestProjectionDTO | null = null;
  selectedLeaveType: string | null = null;
  leaveBalance: number | null = null;
  balancePercent = 0;
  isDraft = false;
  editDraftId: number | null = null;

  get isEditingDraft(): boolean {
    return this.editDraftId !== null;
  }

  leaveForm = this.fb.nonNullable.group(
    {
      leaveType: [null as string | null, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required],
    },
    { validators: this.leaveDateValidator.bind(this) }
  );


  async ngOnInit() {
    this.leavePolicies = this.route.snapshot.data['leavePolicies'] ?? [];
    this.leaveBalances = this.route.snapshot.data['leaveBalances'] ?? [];
    await this.loadDraftForEdit();

    this.leaveForm.get('leaveType')?.valueChanges.subscribe(type => {
      if (!type) {
        this.selectedLeaveType = null;
        this.leaveBalance = null;
        this.balancePercent = 0;
        return;
      }

      this.selectedLeaveType = this.formatType(type);
      this.updateBalance(type);
    });
  }

  async submitRequest(): Promise<void> {
    this.isDraft = false;
    this.leaveForm.updateValueAndValidity();

    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      this.notifications.showWarning('Please fill in all required fields.');
      return;
    }

    const payload = this.buildPayload();

    try {
      const data = this.editDraftId
        ? await firstValueFrom(
            this.leaveRequestService
              .editLeaveDraft(this.editDraftId, payload)
              .pipe(
                switchMap(() =>
                  this.leaveRequestService.submitExistingLeaveRequest(this.editDraftId!),
                ),
              ),
          )
        : await firstValueFrom(this.leaveRequestService.submitLeaveRequest(payload));

      this.appliedLeave = data;
      this.notifications.showSuccess('Leave request submitted successfully.');
      this.resetForm();
      await this.router.navigate(['/employee/leaves']);
    } catch {
      // LeaveService already surfaces API errors via NotificationService.
    }
  }

  async saveDraft(): Promise<void> {
    this.isDraft = true;
    this.leaveForm.updateValueAndValidity();

    const payload = this.buildPayload();

    try {
      const data = this.editDraftId
        ? await firstValueFrom(this.leaveRequestService.editLeaveDraft(this.editDraftId, payload))
        : await firstValueFrom(this.leaveRequestService.createLeaveDraft(payload));

      this.appliedLeave = data;
      this.isDraft = false;
      this.leaveForm.updateValueAndValidity();
      this.notifications.showInfo('Draft saved successfully.');
      this.resetForm();
      await this.router.navigate(['/employee/leaves/drafts']);
    } catch {
      // LeaveService already surfaces API errors via NotificationService.
    }
  }

  
  updateBalance(type: string | null) {
    if (!type) {
      this.leaveBalance = null;
      this.balancePercent = 0;
      return;
    }

    const balance = this.leaveBalances.find(b => b.leaveTypeName === type);

    if (balance) {
      this.leaveBalance = balance.remainingLeave;
      this.balancePercent = balance.allocatedLeave > 0
        ? Math.round((this.leaveBalance / balance.allocatedLeave) * 100)
        : 0;
    } else {
      this.leaveBalance = 0;
      this.balancePercent = 0;
    }
  }

  getProgressClass(percent: number): string {
    if (percent <= 20) return 'bg-danger';
    if (percent <= 40) return 'bg-warning';
    return 'bg-success';
  }

  formatType(type: string | null | undefined): string {
    if (!type) return '-';
    return type
      .toLowerCase()
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  leaveDateValidator(control: AbstractControl): ValidationErrors | null {
    if (this.isDraft) return null;

    const start = control.get('startDate')?.value;
    const end = control.get('endDate')?.value;

    if (!start || !end) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(start);
    const endDate = new Date(end);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return { startBeforeToday: true };
    }

    if (startDate > endDate) {
      return { invalidRange: true };
    }

    return null;
  }

  private resetForm() {
    this.leaveForm.reset({
      leaveType: null,
      startDate: '',
      endDate: '',
      reason: '',
    });
    this.editDraftId = null;
    this.selectedLeaveType = null;
    this.leaveBalance = null;
    this.balancePercent = 0;
  }

  private async loadDraftForEdit(): Promise<void> {
    const draftId = Number(this.route.snapshot.queryParamMap.get('draftId'));
    if (!draftId) {
      return;
    }

    const draftFromState = history.state?.draft as LeaveRequestProjectionDTO | undefined;
    const draft =
      draftFromState?.id === draftId
        ? draftFromState
        : (await firstValueFrom(this.leaveRequestService.getEmployeeLeaveDrafts())).find(
            (item) => item.id === draftId,
          );

    if (!draft) {
      this.notifications.showWarning('Draft not found. Start a new request instead.');
      return;
    }

    this.editDraftId = draftId;
    this.leaveForm.patchValue({
      leaveType: draft.leaveType,
      startDate: this.toDateInputValue(draft.startDate),
      endDate: this.toDateInputValue(draft.endDate),
      reason: draft.reason ?? '',
    });
    this.selectedLeaveType = this.formatType(draft.leaveType);
    this.updateBalance(draft.leaveType);
  }

  private toDateInputValue(value: string): string {
    return value?.slice(0, 10) ?? '';
  }



  private buildPayload(): CreateLeaveRequestDTO {
    const raw = this.leaveForm.getRawValue();
    return {
      leaveType: raw.leaveType ?? '',
      startDate: raw.startDate,
      endDate: raw.endDate,
      reason: raw.reason ?? '',
    };
  }
}
