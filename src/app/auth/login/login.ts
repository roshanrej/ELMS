import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
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

  ngOnInit(): void {
    const user = this.authStore.currentUser;
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
      this.navigateAfterLogin(user.role);
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
  private navigateAfterLogin(role: string): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    // TODO: For better UX, validate returnUrl exists as a real route
    // For now, just redirect to default role-based route
    if (returnUrl && returnUrl.startsWith('/')) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    this.navigateByRole(role);
  }

  /**
   * Navigate to the default dashboard for a given role.
   */
  private navigateByRole(role: string): void {
    const dashboardMap: Record<string, string> = {
      'ADMIN': '/admin/dashboard',
      'EMPLOYEE': '/employee/dashboard',
      'MANAGER': '/manager/dashboard'
    };

    const dashboard = dashboardMap[role] || '/login';
    this.router.navigate([dashboard]);
  }
}
 