import { Component, inject, signal } from '@angular/core';
import { LeaveService } from '../../../../core/services/leave/leave';
import { LeaveModel} from '../../../../core/models/leave-model';
import { LeaveStatusEnum } from '../../../../core/models/leave-status-enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveTypeEnum } from '../../../../core/models/leave-type-enum';

@Component({
  selector: 'app-my-leaves',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-leaves.html',
  styleUrl: './my-leaves.scss',
})
export class MyLeaves {
  LeaveTypeEnum = LeaveTypeEnum
  selectedType : LeaveTypeEnum|'ALL' = 'ALL';
  LeaveStatusEnum = LeaveStatusEnum
  selectedStatus: LeaveStatusEnum | 'ALL' = 'ALL';
  
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
    console.log(this.years)
  }

  ngOnInit() {
    this.leaveService.getEmployeeLeaves().subscribe(data => {
    this.employeeLeaves = data || [];
    
    // ✅ NOW data exists
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

  statusClassMap: Record<string, string> = {
    APPROVED: 'badge-soft-green',
    PENDING: 'badge-soft-yellow',
    REJECTED: 'badge-soft-red',
    CANCELLED: 'badge-soft-gray'
  };

  getAvailableActions(status: string): string[] {
    switch (status) {
      case 'PENDING':
        return ['EDIT', 'CANCEL'];

      case 'APPROVED':
        return ['CANCEL']; // optional based on policy

      default:
        return [];
    }
  }
} 
