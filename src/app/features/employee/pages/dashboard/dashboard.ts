import { CommonModule } from '@angular/common';
import { Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LeaveModel } from '../../../../core/models/leave/leave-model';

type UpcomingLeaveView = LeaveModel & { daysLabel: string };

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

  this.extractUpcoming();
}

  /**
   * Do NOT calculate business metrics on frontend.
   * Backend should provide:
   * - leaveBalance: from getMyBalances() API endpoint
   * - usedDays: pre-calculated from approved leaves
   * - pendingCount: from a dedicated API endpoint
   * 
   * TODO: Wire up these backend APIs instead of local calculation.
   * For now, leave values as 0 to prevent incorrect data display.
   */
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

  statusClassMap: Record<string, string> = {
    APPROVED: 'badge-soft-green',
    PENDING: 'badge-soft-yellow',
    REJECTED: 'badge-soft-red',
    CANCELLED: 'badge-soft-gray',
    DRAFT: 'badge-soft-gray'
  };

}
