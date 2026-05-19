import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../../auth/store/auth.store';
import { RoleTypeEnum } from '../../../core/types-enums/role-type.enum';
import { AuthService } from '../../../auth/services/auth.service';
import { LoginResponse } from '../../../core/models/auth/login-response.model';

interface NavLink {
  label: string;
  route: string;
}

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

  private readonly navLinksMap: Record<string, NavLink[]> = {
    [RoleTypeEnum.ADMIN]: [
      { label: 'Dashboard', route: '/admin/dashboard' },
      { label: 'Departments', route: '/admin/departments' },
      { label: 'Employees', route: '/admin/employees' },
      { label: 'Leave Quotas', route: '/admin/leave-quotas' },
      { label: 'Analytics', route: '/admin/analytics' },
    ],
    [RoleTypeEnum.EMPLOYEE]: [
      { label: 'Dashboard', route: '/employee/dashboard' },
      { label: 'Request Leave', route: '/employee/leaves/apply' },
      { label: 'Leave History', route: '/employee/leaves' },
      { label: 'View Leave Balance', route: '/employee/leaves/balance' },
      { label: 'View Drafts', route: '/employee/leaves/drafts' },
    ],
    [RoleTypeEnum.MANAGER]: [
      { label: 'Dashboard', route: '/manager/dashboard' },
      { label: 'Approvals', route: '/manager/approvals' },
      { label: 'View Leaves', route: '/manager/view-leaves' },
      { label: 'Leave Analytics', route: '/manager/leave-analytics' },
    ],
  };

  ngOnInit(): void {
    const userRole = this.authStore.currentUser?.role;
    if (userRole) {
      this.navLinks = this.navLinksMap[userRole] || [];
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
