import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeaveBalanceModel } from '../../../../core/models/leave/leave-balance.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnualLeavePolicy } from '../../../../../environments/environment.development';
import { LeaveTypeEnum } from '../../../../core/types-enums/leave-type-enum';

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
export class LeaveBalance implements OnInit {
  private route = inject(ActivatedRoute);

  AnnualLeavePolicy = AnnualLeavePolicy;
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

  getDefaultAllocation(type: LeaveTypeEnum): number {
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
}