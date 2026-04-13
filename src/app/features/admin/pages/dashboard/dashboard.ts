import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserModel } from '../../../../core/models/user.model';
import { AuthStore } from '../../../../auth/store/auth.store';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private router = inject(Router);
  selectedAction = signal<string | null>(null);

  private authStore :AuthStore = inject(AuthStore)
  user :UserModel | null = null

  employeeCount = 0;
  departmentCount = 0;
  pendingRequests = 0;

  users : UserModel[] = []
  

  ngOnInit() {
    // later replace with API/store
    this.user = this.authStore.currentUser
    this.employeeCount = 12;
    this.departmentCount = 4;
    this.pendingRequests = 3;
  }

  dispatchAction(label: string, route: string) {
    this.selectedAction.set(label);
    this.router.navigate([route]);
  }
}
