import { Component, inject } from '@angular/core';
import { LeaveTypeEnum } from '../../../../core/models/leave-type-enum';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveService } from '../../../../core/services/leave/leave';

import { LeaveRequestModel } from '../../../../core/models/leave-request.model';
import { LeaveModel } from '../../../../core/models/leave-model';

@Component({
  selector: 'app-apply-leave',
  imports: [CommonModule,ReactiveFormsModule ],
  templateUrl: './apply-leave.html',
  styleUrl: './apply-leave.scss',
})
export class ApplyLeave {
 LeaveTypeEnum = LeaveTypeEnum;
 private leaveService : LeaveService = inject(LeaveService)
 private fb : FormBuilder = inject(FormBuilder)
 appliedLeave:LeaveModel |null = null
 
  // 🔥 form model
 leaveForm = this.fb.nonNullable.group({
  leaveType: [LeaveTypeEnum.Annual, Validators.required],
  startDate: ['', Validators.required],
  endDate: ['', Validators.required],
  reason: ['', Validators.required]
});
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
    if(this.leaveForm.invalid){
      alert("Missing required fields.")
      return ;
    }

   if (this.leaveForm.invalid) return;

const raw = this.leaveForm.getRawValue();

const leave: LeaveRequestModel = {
  leaveType: raw.leaveType,
  startDate: new Date(raw.startDate),
  endDate: new Date(raw.endDate),
  reason: raw.reason
};

this.leaveService.requestLeave(leave).subscribe(data=>{
 this.appliedLeave = data
 console.log(this.appliedLeave) // check for arrived data
})
    

    // later   // call API here
  }

  saveDraft() {
    const raw = this.leaveForm.getRawValue();
    const leave: LeaveRequestModel = {
  leaveType: raw.leaveType,
  startDate: new Date(raw.startDate),
  endDate: new Date(raw.endDate),
  reason: raw.reason
};

this.leaveService.saveDraft(leave).subscribe(data=>{
 this.appliedLeave = data
 console.log(this.appliedLeave) // check for arrived data
})
  }
}
