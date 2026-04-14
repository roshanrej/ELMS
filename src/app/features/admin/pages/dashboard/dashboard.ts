import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserModel } from '../../../../core/models/user.model';
import { AuthStore } from '../../../../auth/store/auth.store';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private router = inject(Router);
  private authStore: AuthStore = inject(AuthStore);

  selectedAction = signal<string | null>(null);
  user: UserModel | null = null;

  summaryCards = [
    { label: 'Total Employees', value: '12', helper: 'Employee records currently available in admin', tag: 'Records' },
    { label: 'Departments', value: '4', helper: 'Department entries mapped in the admin module', tag: 'Structure' },
    { label: 'Pending Requests', value: '3', helper: 'Leave requests still waiting for action', tag: 'Requests' },
    { label: 'Approvals Today', value: '7', helper: 'Request updates completed during this session', tag: 'Activity' },
  ];

  focusPanels = [
    { title: 'Approvals Queue', metric: '03', note: 'Three leave requests still need admin follow-up or routing checks.' },
    { title: 'Quota Updates', metric: '02', note: 'Two quota entries still need review before they can be used consistently.' },
    { title: 'Profile Updates', metric: '04', note: 'Four employee records still need department or balance fields completed.' },
  ];

  activityFeed = [
    { title: 'Employee records updated', detail: 'Recent employee profile changes are available in the employee directory.' },
    { title: 'Request statuses changed', detail: 'Three leave requests moved forward in the approval flow today.' },
    { title: 'Quota entries reviewed', detail: 'Annual leave quota values were checked for the current setup cycle.' },
  ];

  quickActions = [
    {
      title: 'Manage Employees',
      description: 'Open employee records to add users, edit profile details, or check leave balances.',
      route: '/admin/employees',
      meta: 'Employees',
    },
    {
      title: 'Review Departments',
      description: 'Check department entries and manager mappings used by the admin workflow.',
      route: '/admin/departments',
      meta: 'Departments',
    },
    {
      title: 'Adjust Leave Quotas',
      description: 'Edit leave quota values and review current allocation rows.',
      route: '/admin/leave-quotas',
      meta: 'Quotas',
    },
    {
      title: 'Open Analytics',
      description: 'View a simple admin analytics skeleton for requests, balances, and department counts.',
      route: '/admin/analytics',
      meta: 'Analytics',
    },
  ];

  ngOnInit() {
    this.user = this.authStore.currentUser;
  }

  dispatchAction(label: string, route: string) {
    this.selectedAction.set(label);
    this.router.navigate([route]);
  }
}
