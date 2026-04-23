import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeaveBalanceModel } from '../../../../core/models/leave/leave-balance.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-leave-balance',
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-balance.html',
  styleUrl: './leave-balance.scss',
})
export class LeaveBalance implements OnInit{
  private route = inject(ActivatedRoute);
 
  balances: LeaveBalanceModel[] = [];
 
  ngOnInit() {
    this.balances = this.route.snapshot.data['balances'] ?? [];
  }
 
  getPercent(balance: LeaveBalanceModel): number {
    if (!balance.allocated || balance.allocated === 0) return 0;
    return Math.round((balance.remaining / balance.allocated) * 100);
  }
 
  getProgressClass(percent: number): string {
    if (percent <= 25) return 'bg-danger';
    if (percent <= 50) return 'bg-warning';
    return ''; // defaults to --app-red via global .progress-bar
  }
 
  formatValue(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
