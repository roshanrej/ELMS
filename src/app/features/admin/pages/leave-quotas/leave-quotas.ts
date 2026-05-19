import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface LeaveQuota {
  type: string;
  total: number;
  used: number;
  remaining: number;
}

@Component({
  selector: 'app-leave-quotas',
  imports: [CommonModule],
  templateUrl: './leave-quotas.html',
  styleUrl: './leave-quotas.scss',
})
export class LeaveQuotasPage {
  quotas: LeaveQuota[] = [];
}
