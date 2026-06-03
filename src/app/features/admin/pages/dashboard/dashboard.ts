import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthStore } from '../../../../auth/store/auth.store';
import { UserContextDTO } from '../../../../core/dtos/user/user.model';

interface SummaryCard {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboardPage implements OnInit {
  private authStore = inject(AuthStore);
  user: UserContextDTO | null = null;
  summaryCards: SummaryCard[] = [];

  ngOnInit(): void {
    this.user = this.authStore.currentUser;
  }
}
