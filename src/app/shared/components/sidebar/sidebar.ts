import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../../auth/store/auth.store';
import { RoleTypeEnum } from '../../../core/types-enums/role-type.enum';
import { UserModel } from '../../../core/models/user/user.model';
import { AuthService } from '../../../auth/services/auth';
import { LoginResponse } from '../../../core/models/auth/login-response.model';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  private authStore = inject(AuthStore);
  private authService: AuthService = inject(AuthService)
  user : LoginResponse| null = this.authStore.currentUser
  
  navLinks: { label: string; route: string }[] = [];

  navLinksMap = {
    ADMIN: [
      { label: 'Dashboard', route: '/admin/dashboard' },
      { label: 'Departments', route: '/admin/departments' },
      { label: 'Employees', route: '/admin/employees' },
      { label: 'Leave Quotas', route: '/admin/leave-quotas' },
      { label: 'Analytics', route: '/admin/analytics' },
    ],
    EMPLOYEE: [
      { label: 'Dashboard', route: '/employee/dashboard' },
      { label: 'Request Leave', route: '/employee/request-leave' },
      { label: 'View Leaves', route: '/employee/leaves' },
      { label: 'View Leave Balance', route: '/employee/leave-balance' },
      { label: 'View Drafts', route: '/employee/drafts' }
    ],
    MANAGER: [
      { label: 'Dashboard', route: '/manager/dashboard' },
      { label: 'Approvals', route: '/manager/approvals' },
      { label: 'View Leaves', route: '/manager/view-leaves' },
      { label: 'Leave Analytics', route: '/manager/leave-analytics' },
      
    ],
  };

  ngOnInit() {
    const userRole = this.authStore.currentUser?.role;

    if (userRole === RoleTypeEnum.ADMIN) {
      this.navLinks = this.navLinksMap.ADMIN;
      return;
    }

    if (userRole === RoleTypeEnum.EMPLOYEE) {
      this.navLinks = this.navLinksMap.EMPLOYEE;
      return;
    }
 if (userRole === RoleTypeEnum.MANAGER) {
    this.navLinks = this.navLinksMap.MANAGER;
      return;
    }
    
  }
  logout(){
this.authService.logout()
  }
  
}
