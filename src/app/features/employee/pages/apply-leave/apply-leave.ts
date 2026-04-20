import { Component, inject } from '@angular/core';
import { LeaveTypeEnum } from '../../../../core/models/leave-type-enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../../../core/services/leave/leave';

@Component({
  selector: 'app-apply-leave',
  imports: [CommonModule,FormsModule],
  templateUrl: './apply-leave.html',
  styleUrl: './apply-leave.scss',
})
export class ApplyLeave {
 LeaveTypeEnum = LeaveTypeEnum;
 private leaveService : LeaveService = inject(LeaveService)

  // 🔥 form model
  form = {
    leaveType: null as LeaveTypeEnum | null,
    startDate: '',
    endDate: '',
    reason: ''
  };

  // 🔥 dropdown options
  leaveTypeOptions = [
    { label: 'Annual Leave', value: LeaveTypeEnum.Annual },
    { label: 'Sick Leave', value: LeaveTypeEnum.Sick },
    { label: 'Casual Leave', value: LeaveTypeEnum.Casual },
    { label: 'Paternity Leave', value: LeaveTypeEnum.Paternity },
    { label: 'Maternity Leave', value: LeaveTypeEnum.Maternity },
    { label: 'Unpaid Leave', value: LeaveTypeEnum.Unpaid }
  ];

  // 🔥 dummy balance
  leaveBalance = 14;
  balancePercent = 58;

  // 🔥 submit
  submitRequest() {
    console.log('Submitting:', this.form);

    // later:
    // call API here
  }

  saveDraft() {
    console.log('Draft saved:', this.form);
  }
}
