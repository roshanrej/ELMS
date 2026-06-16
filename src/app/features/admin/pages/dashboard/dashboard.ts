import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../../auth/store/auth.store';
import { UserContextDTO } from '../../../../core/dtos/user/user.model';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { AppNavItem, getNavigationForRole } from '../../../../shared/config/navigation.config';

interface SummaryCard {
  label: string;
  value: string;
  note: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, PageHeader, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboardPage implements OnInit {
  private readonly authStore = inject(AuthStore);

  user: UserContextDTO | null = null;
  summaryCards: SummaryCard[] = [];
  quickLinks: AppNavItem[] = [];

  ngOnInit(): void {
    this.user = this.authStore.currentUser;
    this.quickLinks = getNavigationForRole('ADMIN').filter((item) => item.route !== '/admin/dashboard');
  }
}