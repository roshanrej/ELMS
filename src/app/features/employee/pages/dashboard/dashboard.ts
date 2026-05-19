import { CommonModule } from '@angular/common';
import { Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LeaveModel } from '../../../../core/models/leave/leave-model';

import { LeaveStatusEnum } from '../../../../core/types-enums/leave-status-enum';


type UpcomingLeaveView = LeaveModel & { leaveDays: number };

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink,CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class EmployeeDashboardPage implements OnInit {
  employeeLeaves: LeaveModel[] = [];

  private route : ActivatedRoute = inject(ActivatedRoute)
  leaveBalance = 0;
  usedDays = 0;
  pendingCount = 0;
  upcomingLeaves: UpcomingLeaveView[] = [];
  usedPercent = 0;

 ngOnInit() {
  const data = this.route.snapshot.data['leaves'];

  this.employeeLeaves = data || [];

  this.computeStats();
  this.extractUpcoming();
}

  computeStats() {
    const currentYear = new Date().getFullYear();

    const thisYearLeaves = this.employeeLeaves.filter(l =>
      new Date(l.startDate).getFullYear() === currentYear
    )
    // 🔥 Used days (approved only)
    this.usedDays = thisYearLeaves
      .filter(l => l.status === LeaveStatusEnum.Approved)
      .reduce((sum, l) => sum + this.getLeaveDays(l), 0);
      
    // 🔥 Pending count

    
    this.pendingCount = this.employeeLeaves
      .filter(l => l.status === LeaveStatusEnum.Pending )
      .length;

    // 🔥 Example balance (assume 24/year)
    // this.leaveBalance =  AnnualLeavePolicy.Total - this.usedDays;
    // this.usedPercent = AnnualLeavePolicy.Total > 0
    //   ? Math.min(100, Math.round((this.usedDays / AnnualLeavePolicy.Total) * 100))
    //   : 0;
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

  extractUpcoming() {
    const today = new Date();

    this.upcomingLeaves = this.employeeLeaves
      .filter(l => new Date(l.startDate) >= today)
      .sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .slice(0, 5)
      .map(leave => ({ ...leave, leaveDays: this.getLeaveDays(leave) }));
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
    CANCELLED: 'badge-soft-gray',
    DRAFT: 'badge-soft-gray'
  };

}
