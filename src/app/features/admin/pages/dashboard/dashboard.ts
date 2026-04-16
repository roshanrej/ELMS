import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserModel } from '../../../../core/models/user.model';
import { AuthStore } from '../../../../auth/store/auth.store';
import {  RoleType } from '../../../../core/models/role.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private router = inject(Router);
  private authStore: AuthStore = inject(AuthStore);
  selectedAction = signal<string | null>(null);
  user: UserModel | null = null;
  summaryCards = [
    { label: 'Employees', value: '12', note: 'Active records in the current workspace' },
    { label: 'Departments', value: '04', note: 'Teams available for leave mapping' },
    { label: 'Pending Requests', value: '03', note: 'Requests waiting for action' },
  ];

  ngOnInit() {
    
    this.user = this.authStore.currentUser
    
  }

 
}
