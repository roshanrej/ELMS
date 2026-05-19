import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthStore } from '../../../../auth/store/auth.store';
import { LoginResponse } from '../../../../core/models/auth/login-response.model';

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
  user: LoginResponse | null = null;
  summaryCards: SummaryCard[] = [];

  ngOnInit(): void {
    this.user = this.authStore.currentUser;
  }
}
