import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-leave-quotas',
  imports: [CommonModule],
  templateUrl: './leave-quotas.html',
  styleUrl: './leave-quotas.scss',
})
export class LeaveQuotas {
  quotas = [
    { type: 'Annual Leave', total: 24, used: 10, remaining: 14 },
    { type: 'Sick Leave', total: 12, used: 3, remaining: 9 },
    { type: 'Casual Leave', total: 8, used: 2, remaining: 6 },
    { type: 'Work From Home', total: 18, used: 7, remaining: 11 },
  ];
}
