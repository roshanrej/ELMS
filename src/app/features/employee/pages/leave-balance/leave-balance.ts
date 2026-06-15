import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeaveBalanceProjectionDTO } from '../../../../core/dtos/leave-balance/leave-balance.projection.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

type LeaveBalanceView = LeaveBalanceProjectionDTO & {
  remainingPercent: number;
  severityClass: string;
  progressClass: string;
};

@Component({
  selector: 'app-leave-balance',
  imports: [CommonModule, FormsModule, PageHeader],
  templateUrl: './leave-balance.html',
  styleUrl: './leave-balance.scss',
})
export class LeaveBalancePage implements OnInit {
  private route = inject(ActivatedRoute);

  balances: LeaveBalanceProjectionDTO[] = [];
  balanceViews: LeaveBalanceView[] = [];

  ngOnInit() {
    this.balances = this.route.snapshot.data['leaveBalances'] ?? [];
    this.balanceViews = this.balances.map(balance => {
      const remainingPercent = this.getRemainingPercent(balance);
      return {
        ...balance,
        remainingPercent,
        severityClass: this.getCardSeverityClass(remainingPercent),
        progressClass: this.getProgressClass(remainingPercent),
      };
      
    });
    
  }

  getRemainingPercent(balance: LeaveBalanceProjectionDTO): number {
    if (!balance.allocatedLeave) return 0;
    return Math.round((balance.remainingLeave / balance.allocatedLeave) * 100);
  }

  

  getCardSeverityClass(percent: number): string {
    if (percent <= 20) return 'app-card--danger';
    if (percent <= 40) return 'app-card--warning';
    return '';
  }

  getProgressClass(percent: number): string {
    if (percent <= 20) return 'bg-danger';
    if (percent <= 40) return 'bg-warning';
    return 'bg-success';
  }

  formatValue(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  getDefaultAllocation(type: string): number {
    return this.balances.find(balance => balance.leaveTypeName === type)?.allocatedLeave ?? 0;
  }
}
