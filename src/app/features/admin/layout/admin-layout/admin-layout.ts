import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../../../auth/services/auth';
import { UserModel } from '../../../../core/models/user.model';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../../../auth/store/auth.store';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout implements OnInit {
  private auth: Auth = inject(Auth)
  user : UserModel | null = null
  private authStore : AuthStore = inject(AuthStore)

 ngOnInit() {
  this.authStore.user$.subscribe(user => {
    this.user = user;
  });
}

logout() {
  this.authStore.setUser(null)
  this.auth.logout();
}
}
