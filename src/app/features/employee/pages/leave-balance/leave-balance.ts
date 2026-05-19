import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeaveBalanceModel } from '../../../../core/models/leave/leave-balance.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



type LeaveBalanceView = LeaveBalanceModel & {
  remainingPercent: number;
  severityClass: string;
  progressClass: string;
};

@Component({
  selector: 'app-leave-balance',
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-balance.html',
  styleUrl: './leave-balance.scss',
})
export class LeaveBalancePage implements OnInit {
  private route = inject(ActivatedRoute);


  balances: LeaveBalanceModel[] = [];
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

  getRemainingPercent(balance: LeaveBalanceModel): number {
    if (!balance.allocated) return 0;
    return Math.round((balance.remaining / balance.allocated) * 100);
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
    return this.balances.find(balance => balance.leaveType === type)?.allocated ?? 0;
  }
}
