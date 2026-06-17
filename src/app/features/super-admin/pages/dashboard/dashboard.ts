import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../../auth/store/auth.store';
import { UserContextDTO } from '../../../../core/dtos/user/user.model';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { AppNavItem, getNavigationForRole } from '../../../../shared/config/navigation.config';

@Component({
  selector: 'app-super-admin-dashboard',
  imports: [CommonModule, PageHeader, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class SuperAdminDashboardPage implements OnInit {
  private readonly authStore = inject(AuthStore);

  user: UserContextDTO | null = null;
  quickLinks: AppNavItem[] = [];

  ngOnInit(): void {
    this.user = this.authStore.currentUser;
    this.quickLinks = getNavigationForRole('SUPER_ADMIN').filter(
      (item) => item.route !== '/super-admin/dashboard',
    );
  }
}