import { Component, inject, OnInit } from '@angular/core';
import { LeaveTypeEnum } from '../../../../core/types-enums/leave-type-enum';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators ,AbstractControl,ValidationErrors} from '@angular/forms';
import { LeaveService } from '../../../../core/services/leave/leave';
import { LeaveRequestModel } from '../../../../core/models/leave/leave-request.model';
import { LeaveModel } from '../../../../core/models/leave/leave-model';
import { AnnualLeavePolicy } from '../../../../../environments/environment.development';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-apply-leave',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apply-leave.html',
  styleUrl: './apply-leave.scss',
})
export class ApplyLeave implements OnInit {
  LeaveTypeEnum = LeaveTypeEnum;

  private leaveService = inject(LeaveService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  appliedLeave: LeaveModel | null = null;
  
  // 🔥 Sidebar state
  selectedLeaveType: string | null = null;
  leaveBalance: number | null = null;
  balancePercent: number = 0;
  isDraft: boolean = false
  // 🔥 Resolved leaves for used-days calculation
  private employeeLeaves: LeaveModel[] = [];

  // 🔥 Form
  leaveForm = this.fb.nonNullable.group({
    leaveType: [null as LeaveTypeEnum | null, Validators.required],
    startDate: ['', Validators.required,],
    endDate:   ['', Validators.required],
    reason:    ['', Validators.required],
  },{validators: !this.isDraft ? this.leaveDateValidator:null});

  // 🔥 Dropdown options
  leaveTypeOptions = [
    { label: 'Annual Leave',    value: LeaveTypeEnum.Annual },
    { label: 'Sick Leave',      value: LeaveTypeEnum.Sick },
    { label: 'Casual Leave',    value: LeaveTypeEnum.Casual },
    { label: 'Paternity Leave', value: LeaveTypeEnum.Paternity },
    { label: 'Maternity Leave', value: LeaveTypeEnum.Maternity },
    { label: 'Unpaid Leave',    value: LeaveTypeEnum.Unpaid },
  ];

  ngOnInit() {
    // Reuse leaves already resolved by the parent route if available
    this.employeeLeaves = this.route.snapshot.data['leaves'] ?? [];

    // Update sidebar whenever leave type changes
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
  // 🔥 Balance helpers
  updateBalance(type: LeaveTypeEnum | null) {
    if (!type) {
      this.leaveBalance = null;
      this.balancePercent = 0;
      return;
    }

    const allocated = this.getAllocation(type);
    const used = this.getUsedDays(type);
    this.leaveBalance = Math.max(allocated - used, 0);
    this.balancePercent = allocated > 0
      ? Math.round((this.leaveBalance / allocated) * 100)
      : 0;
  }

  getProgressClass(percent: number): string {
    if (percent <= 20) return 'bg-danger';
    if (percent <= 40) return 'bg-warning';
    return 'bg-success';
  }

  private getAllocation(type: LeaveTypeEnum): number {
    switch (type) {
      case LeaveTypeEnum.Annual:    return AnnualLeavePolicy.Annual;
      case LeaveTypeEnum.Sick:      return AnnualLeavePolicy.Sick;
      case LeaveTypeEnum.Casual:    return AnnualLeavePolicy.Casual;
      case LeaveTypeEnum.Unpaid:    return AnnualLeavePolicy.Unpaid;
      case LeaveTypeEnum.Maternity: return AnnualLeavePolicy.Maternity;
      case LeaveTypeEnum.Paternity: return AnnualLeavePolicy.Paternity;
      default: return 0;
    }
  }

  private getUsedDays(type: LeaveTypeEnum): number {
    const currentYear = new Date().getFullYear();
    return this.employeeLeaves
      .filter(l =>
        l.leaveType === type &&
        l.status === 'APPROVED' &&
        new Date(l.startDate).getFullYear() === currentYear
      )
      .reduce((sum, l) => sum + this.calcDays(l.startDate, l.endDate), 0);
  }

  private calcDays(start: Date, end: Date): number {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
  }

  private formatType(type: string): string {
    return type.charAt(0) + type.slice(1).toLowerCase();
  }

  // 🔥 Submit
 submitRequest() {
  if (this.leaveForm.invalid) {
    alert('Please fill in all required fields.');
    return;
  }
  const leave = this.buildPayload();
  this.leaveService.requestLeave(leave).subscribe(data => {
    this.appliedLeave = data;
    alert('Leave request submitted.');
    this.resetForm();
  });
}

saveDraft() {
   const leaveType = this.leaveForm.controls['leaveType']
    
  if (!leaveType?.value) {
    leaveType.setErrors({leaveType:false})
    return;
  }
  const leave = this.buildPayload();
  this.leaveService.saveDraft(leave).subscribe(data => {
    this.appliedLeave = data;
    alert('Draft saved.');
    this.resetForm();
  });
}

  private buildPayload(): LeaveRequestModel {
    const raw = this.leaveForm.getRawValue();
    return {
      leaveType:  raw.leaveType,
      startDate:  new Date(raw.startDate),
      endDate:    new Date(raw.endDate),
      reason:     raw.reason,
    };
  }

  leaveDateValidator(control: AbstractControl): ValidationErrors | null {
  
  const start = control.get('startDate')?.value;
  const end = control.get('endDate')?.value;
  
  
  if (!start || !end) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(start);
  const endDate = new Date(end);

  // normalize time
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  // ❌ startDate < today
 if (startDate < today) {
  start?.setErrors({ startBeforeToday: true });
}

if (startDate > endDate) {
  end?.setErrors({ invalidRange: true });
}

  return null;
}
}