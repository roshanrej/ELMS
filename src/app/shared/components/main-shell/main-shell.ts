import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthStore } from '../../../auth/store/auth.store';
import { getNavigationForRole } from '../../config/navigation.config';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-shell',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './main-shell.html',
  styleUrl: './main-shell.scss',
})
export class MainShell implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private navigationSubscription?: Subscription;

  readonly pageTitle = signal('Workspace');

  ngOnInit(): void {
    this.updatePageTitle();
    this.navigationSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updatePageTitle());
  }

  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
  }

  private updatePageTitle(): void {
    const navItems = getNavigationForRole(this.authStore.currentUser?.role);
    const activeItem = navItems.find((item) =>
      this.router.isActive(item.route, {
        paths: 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      }),
    );

    this.pageTitle.set(activeItem?.label ?? 'Workspace');
  }
}