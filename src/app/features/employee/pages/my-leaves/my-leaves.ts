import { Component, inject, signal } from '@angular/core';
import { LeaveService } from '../../../../core/services/leave/leave';
import { LeaveModel} from '../../../../core/models/leave/leave-model';
import { LeaveStatusEnum } from '../../../../core/types-enums/leave-status-enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveTypeEnum } from '../../../../core/types-enums/leave-type-enum';
import { ActivatedRoute } from '@angular/router';
import { LeaveActionEnum } from '../../../../core/types-enums/leave-action.enum';
@Component({
  selector: 'app-my-leaves',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-leaves.html',
  styleUrl: './my-leaves.scss',
})
export class MyLeaves {
  LeaveActionEnum = LeaveActionEnum
  LeaveTypeEnum = LeaveTypeEnum
  selectedType : LeaveTypeEnum|'ALL' = 'ALL';
  LeaveStatusEnum = LeaveStatusEnum
  selectedStatus: LeaveStatusEnum | 'ALL' = 'ALL';
  private route : ActivatedRoute = inject(ActivatedRoute)
  years: number[] = [];
  selectedYear: number | 'ALL' = 'ALL';
  employeeLeaves: LeaveModel[] = [] //leaves fetched from API
  isLoading = signal(true);
  filteredLeaves :LeaveModel[] = [];
  private leaveService: LeaveService = inject(LeaveService)
  
  
  applyFilters() {
  let filtered = this.employeeLeaves;
  // 🔹 Year filter
  if (this.selectedYear !== 'ALL') {
    filtered = filtered.filter(leave =>
      new Date(leave.startDate).getFullYear() === this.selectedYear
    );
  }

  // 🔹 Status filter
  if (this.selectedStatus !== 'ALL') {
    filtered = filtered.filter(leave =>
      leave.status === this.selectedStatus
    );
  }
  if (this.selectedType !== 'ALL') {
    filtered = filtered.filter(leave =>
      leave.leaveType === this.selectedType
    );
  }

  this.filteredLeaves = filtered;
}
  extractYears() {
    const yearSet = new Set<number>();
    this.employeeLeaves.forEach(leave => {
      const year = new Date(leave.startDate).getFullYear();
      yearSet.add(year);
    });
    this.years = Array.from(yearSet).sort((a, b) => b - a); // latest first
  }
ngOnInit() {
  const mode = this.route.snapshot.data['mode'];

  this.leaveService.getEmployeeLeaves().subscribe(data => {
    const leaves = mode === 'draft'
      ? data.filter(d => d.status === LeaveStatusEnum.Draft)
      : data.filter(d=>d.status!== LeaveStatusEnum.Draft) ?? [];

    this.employeeLeaves = leaves;

    this.extractYears();
    this.applyFilters();

    this.isLoading.set(false);
  });
}

  getLeaveDays(leave: LeaveModel): number {
    const start = new Date(leave.startDate).getTime();
    const end = new Date(leave.endDate).getTime();
    return (end - start) / (1000 * 60 * 60 * 24) + 1;
  }

  statusClassMap: Record<LeaveStatusEnum, string> = {
  [LeaveStatusEnum.Approved]: 'badge-soft-green',
  [LeaveStatusEnum.Pending]: 'badge-soft-yellow',
  [LeaveStatusEnum.Rejected]: 'badge-soft-red',
  [LeaveStatusEnum.Cancelled]: 'badge-soft-gray',
  [LeaveStatusEnum.Draft]: 'badge-soft-gray'
};

 getAvailableActions(status: LeaveStatusEnum): LeaveActionEnum[] {
  switch (status) {
    case LeaveStatusEnum.Approved:
      return [LeaveActionEnum.Cancel]

    case LeaveStatusEnum.Draft:
      return [
        LeaveActionEnum.Edit,
        LeaveActionEnum.Delete,
        LeaveActionEnum.Submit
      ];

    case LeaveStatusEnum.Pending:
      return [LeaveActionEnum.Cancel];

    default:
      return [];
  }
}
} 
