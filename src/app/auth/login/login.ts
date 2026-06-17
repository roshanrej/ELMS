import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStore } from '../store/auth.store';

/**
 * ARCHITECTURAL NOTE:
 * This component handles login UI and basic navigation.
 * Authorization logic (which routes a user can access) is backend-owned.
 * Frontend should not validate returnUrl against role.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage implements OnInit {
  submitted: boolean = false;
  loading: boolean = false;
  serverError: string = '';
  passwordVisible: boolean = false;
  loginForm: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authStore = inject(AuthStore);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async ngOnInit(): Promise<void> {
    const user = this.authStore.currentUser ?? await this.authService.restoreSession();
    if (user) {
      this.navigateByRole(user.role);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  async login(): Promise<void> {
    this.submitted = true;
    this.serverError = '';

    if (this.loginForm.invalid) return;

    try {
      this.loading = true;
      const user = await this.authService.loginUser(this.loginForm.value);
      await this.navigateAfterLogin(user.role);
    } catch (error: any) {
      this.serverError = error.message || 'Server error';
      this.loginForm.get('password')?.reset();
    } finally {
      this.loading = false;
    }
  }

  /**
   * Navigate to the appropriate dashboard for the user's role.
   * Do NOT validate returnUrl against role - guards and backend will enforce access.
   */
  private async navigateAfterLogin(role: string): Promise<void> {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (returnUrl && await this.isValidReturnUrl(returnUrl)) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    this.navigateByRole(role);
  }

  private async isValidReturnUrl(returnUrl: string): Promise<boolean> {
    if (!returnUrl.startsWith('/') || returnUrl.startsWith('//')) {
      return false;
    }

    try {
      const tree = this.router.parseUrl(returnUrl);
      const segments = tree.root.children['primary']?.segments.map(segment => segment.path) ?? [];
      return this.routeExists(segments, this.router.config);
    } catch {
      return false;
    }
  }

  private async routeExists(segments: string[], routes: any[]): Promise<boolean> {
    for (const route of routes) {
      if (route.path === '**') {
        continue;
      }

      const routeSegments = route.path ? route.path.split('/') : [];
      if (!this.matchesLeadingSegments(segments, routeSegments)) {
        continue;
      }

      const remainingSegments = segments.slice(routeSegments.length);
      if (remainingSegments.length === 0 && (route.component || route.redirectTo !== undefined || route.loadChildren)) {
        return true;
      }

      const children = route.children ?? await route.loadChildren?.();
      if (children && await this.routeExists(remainingSegments, children)) {
        return true;
      }
    }

    return false;
  }

  private matchesLeadingSegments(segments: string[], routeSegments: string[]): boolean {
    return routeSegments.length <= segments.length
      && routeSegments.every((segment, index) => segment.startsWith(':') || segment === segments[index]);
  }

  /**
   * Navigate to the default dashboard for a given role.
   */
  private navigateByRole(role: string): void {
    const dashboardMap: Record<string, string> = {
      'SUPER_ADMIN': '/super-admin/dashboard',
      'ADMIN': '/admin/dashboard',
      'EMPLOYEE': '/employee/dashboard',
      'MANAGER': '/manager/dashboard'
    };

    const dashboard = dashboardMap[role] || '/login';
    this.router.navigate([dashboard]);
  }
}
 
