import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../../auth/store/auth.store';
import { AuthService } from '../../../auth/services/auth.service';
import { UserContextDTO } from '../../../core/dtos/user/user.model';
import { AppNavItem, getNavigationForRole } from '../../config/navigation.config';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user: UserContextDTO | null = null;
  navLinks: AppNavItem[] = [];

  ngOnInit(): void {
    void this.loadNavigation();
  }

  get roleLabel(): string {
    if (!this.user?.role) {
      return '';
    }

    return this.user.role.charAt(0) + this.user.role.slice(1).toLowerCase();
  }

  private async loadNavigation(): Promise<void> {
    this.user = this.authStore.currentUser ?? (await this.authService.restoreSession());
    this.navLinks = getNavigationForRole(this.user?.role);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}