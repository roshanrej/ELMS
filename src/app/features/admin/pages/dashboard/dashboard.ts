import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserModel } from '../../../../core/models/user.model';
import { AuthStore } from '../../../../auth/store/auth.store';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private router = inject(Router);
  private authStore: AuthStore = inject(AuthStore);

  selectedAction = signal<string | null>(null);
  user: UserModel | null = null;

 


  ngOnInit() {
    this.user = this.authStore.currentUser;
  }

 
}
