import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LeaveBalanceModel } from '../../../../core/models/leave/leave-balance.model';
import { LeaveModel } from '../../../../core/models/leave/leave-model';
import { LeaveRequestModel } from '../../../../core/models/leave/leave-request.model';
import { LeaveTypeModel } from '../../../../core/models/leave/leave-type.model';
import { LeaveService } from '../../../../core/services/leave/leave.service';
import { LeaveStatusEnum } from '../../../../core/types-enums/leave-status-enum';

@Component({
  selector: 'app-apply-leave',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apply-leave.html',
  styleUrl: './apply-leave.scss',
})
export class ApplyLeavePage implements OnInit {
  private leaveService = inject(LeaveService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  leaveTypes: LeaveTypeModel[] = [];
  appliedLeave: LeaveModel | null = null;
  selectedLeaveType: string | null = null;
  leaveBalance: number | null = null;
  balancePercent = 0;
  isDraft = false;

  private leaveBalances: LeaveBalanceModel[] = [];
  private employeeLeaves: LeaveModel[] = [];

  leaveForm = this.fb.nonNullable.group(
    {
      leaveType: [null as string | null, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required],
    },
    { validators: this.leaveDateValidator.bind(this) }
  );

  ngOnInit() {
    this.leaveTypes = this.route.snapshot.data['leaveTypes'] ?? [];
    this.employeeLeaves = this.route.snapshot.data['leaves'] ?? [];
    this.leaveBalances = this.route.snapshot.data['leaveBalances'] ?? [];

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

  submitRequest() {
    this.isDraft = false;
    this.leaveForm.updateValueAndValidity();

    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      alert('Please fill in all required fields.');
      return;
    }

    this.leaveService.requestLeave(this.buildPayload()).subscribe(data => {
      this.appliedLeave = data;
      alert('Leave request submitted.');
      this.resetForm();
    });
  }

  saveDraft() {
    this.isDraft = true;
    this.leaveForm.updateValueAndValidity();

    this.leaveService.saveDraft(this.buildPayload()).subscribe(data => {
      this.appliedLeave = data;
      this.isDraft = false;
      this.leaveForm.updateValueAndValidity();
      alert('Draft saved.');
      this.resetForm();
    });
  }

  updateBalance(type: string | null) {
    if (!type) {
      this.leaveBalance = null;
      this.balancePercent = 0;
      return;
    }

    const balance = this.leaveBalances.find(item => item.leaveType === type);
    const allocated = balance?.allocated ?? 0;
    const used = balance?.used ?? this.getUsedDays(type);

    this.leaveBalance = balance ? balance.remaining : Math.max(allocated - used, 0);
    this.balancePercent = allocated > 0
      ? Math.round((this.leaveBalance / allocated) * 100)
      : 0;
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
    this.selectedLeaveType = null;
    this.leaveBalance = null;
    this.balancePercent = 0;
  }

  private getUsedDays(type: string): number {
    const currentYear = new Date().getFullYear();
    return this.employeeLeaves
      .filter(l =>
        l.leaveType === type &&
        l.status === LeaveStatusEnum.Approved &&
        new Date(l.startDate).getFullYear() === currentYear
      )
      .reduce((sum, l) => sum + this.calcDays(new Date(l.startDate), new Date(l.endDate)), 0);
  }

  private calcDays(start: Date, end: Date): number {
    const s = start.getTime();
    const e = end.getTime();
    return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
  }

  private buildPayload(): LeaveRequestModel {
    const raw = this.leaveForm.getRawValue();
    return {
      leaveType: raw.leaveType,
      startDate: this.toDateOnlyString(raw.startDate),
      endDate: this.toDateOnlyString(raw.endDate),
      reason: raw.reason,
    };
  }

  private toDateOnlyString(value: string | null): string | null {
    return value ? value : null;
  }
}
