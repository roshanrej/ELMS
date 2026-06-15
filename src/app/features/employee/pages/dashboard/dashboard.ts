import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { LeaveStatusBadge } from '../../../../shared/components/leave-status-badge/leave-status-badge';

import { LeaveBalanceProjectionDTO } from '../../../../core/dtos/leave-balance/leave-balance.projection.dto';
import { EmployeeLeaveRequestDTO } from '../../../../core/dtos/leave-request/employee-leave-request.dto';
import { LeaveRequestStatusEnum } from '../../../../core/types-enums/leave-request-status-enum';

type UpcomingLeaveView = EmployeeLeaveRequestDTO & { daysLabel: string };

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule, PageHeader, LeaveStatusBadge],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class EmployeeDashboardPage implements OnInit {
  employeeLeaveRequests: EmployeeLeaveRequestDTO[] = [];
  employeeLeaveBalances : LeaveBalanceProjectionDTO[] = [];

  private route : ActivatedRoute = inject(ActivatedRoute)
  annualLeaveBalance = 0;
  annualRemainingDays = 0;
  annualUsedDays = 0;
  pendingCount = 0;
  pendingCancelCount = 0;
  upcomingLeaves: UpcomingLeaveView[] = [];
  usedPercent = 0;

 ngOnInit() {
  const leaveRequests = this.route.snapshot.data['leaveRequests'];
  const leaveBalances = this.route.snapshot.data['leaveBalances'];

  this.employeeLeaveBalances  = leaveBalances || [];
  this.employeeLeaveRequests = leaveRequests || [];
  this.computeLeaveDetails();
  this.extractUpcoming();
}


  getTypeLabel(type: string | null | undefined): string {
    if (!type) return '-';
    return type
      .toLowerCase()
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  computeLeaveDetails(){
this.annualRemainingDays = this.employeeLeaveBalances.filter(lb=> lb.leaveTypeName === 'ANNUAL')
  .reduce((sum, balance) => sum + balance.remainingLeave, 0);
  this.annualLeaveBalance = this.employeeLeaveBalances.filter(
    lb=> lb.leaveTypeName === 'ANNUAL'
  ).reduce((sum,balance)=> sum + balance.allocatedLeave,0);
   this.annualUsedDays = this.employeeLeaveBalances.filter(lb=> lb.leaveTypeName === 'ANNUAL').reduce((sum,balance)=> sum + balance.consumedLeave,0);
   this.pendingCount = this.employeeLeaveRequests.filter(l=> l.status === LeaveRequestStatusEnum.PENDING).length;
   this.pendingCancelCount  = this.employeeLeaveRequests.filter(l=> l.status === LeaveRequestStatusEnum. CANCEL_PENDING).length;
   const annualAllocatedLeave = this.employeeLeaveBalances.filter(lb=> lb.leaveTypeName === 'ANNUAL').reduce((sum,balance)=>sum+ balance.allocatedLeave,0)
   this.usedPercent =
  annualAllocatedLeave > 0
    ? (this.annualUsedDays / annualAllocatedLeave) * 100
    : 0;
  }


  extractUpcoming() {
    const today = new Date();

    this.upcomingLeaves = this.employeeLeaveRequests
      .filter(
  l =>
    l.status === LeaveRequestStatusEnum.APPROVED &&
    new Date(l.startDate) >= today
)
      .sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .slice(0, 5)
      .map(leave => ({ ...leave, daysLabel: this.formatDateRange(leave.startDate, leave.endDate) }));
  }

  /**
   * Display-only formatting of date range.
   * Do NOT use for business calculations.
   */
  formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  }
}
