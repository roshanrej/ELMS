import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../../auth/store/auth.store';
import { AuthService } from '../../../auth/services/auth.service';
import { LoginResponse } from '../../../core/models/auth/login-response.model';

interface NavLink {
  label: string;
  route: string;
}

/**
 * ARCHITECTURAL NOTE:
 * Navigation structure should be API-driven from the backend.
 * Backend returns available navigation items based on user role and permissions.
 * 
 * TODO: Replace hardcoded navLinksMap with API call:
 * - Create AuthService.getNavigation() method
 * - Call it in ngOnInit to fetch user's available routes
 * - Backend can customize per user, role, or organization
 */
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  private authStore = inject(AuthStore);
  private authService = inject(AuthService);
  private router = inject(Router);

  user: LoginResponse | null = this.authStore.currentUser;
  navLinks: NavLink[] = [];

  /**
   * TEMPORARY: Hardcoded navigation structure.
   * This should be replaced with backend API call in getNavigation().
   * Using string keys instead of RoleTypeEnum for flexibility.
   */
  private readonly defaultNavigation: Record<string, NavLink[]> = {
    'ADMIN': [
      { label: 'Dashboard', route: '/admin/dashboard' },
      { label: 'Departments', route: '/admin/departments' },
      { label: 'Employees', route: '/admin/employees' },
      { label: 'Leave Quotas', route: '/admin/leave-quotas' },
      { label: 'Analytics', route: '/admin/analytics' },
    ],
    'EMPLOYEE': [
      { label: 'Dashboard', route: '/employee/dashboard' },
      { label: 'Request Leave', route: '/employee/leaves/apply' },
      { label: 'Leave History', route: '/employee/leaves' },
      { label: 'View Leave Balance', route: '/employee/leaves/balance' },
      { label: 'View Drafts', route: '/employee/leaves/drafts' },
    ],
    'MANAGER': [
      { label: 'Dashboard', route: '/manager/dashboard' },
      { label: 'Approvals', route: '/manager/approvals' },
      { label: 'View Leaves', route: '/manager/view-leaves' },
      { label: 'Leave Analytics', route: '/manager/leave-analytics' },
    ],
  };

  ngOnInit(): void {
    this.loadNavigation();
  }

  /**
   * Fetch navigation structure.
   * TODO: Replace this with backend API call.
   */
  private loadNavigation(): void {
    const userRole = this.authStore.currentUser?.role;
    if (userRole) {
      this.navLinks = this.defaultNavigation[userRole] || [];
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
