import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleTypeEnum } from '../../core/types-enums/role-type.enum';
import { AuthStore } from '../store/auth.store';

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

  private navigateAfterLogin(role: RoleTypeEnum): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (returnUrl && this.canUseReturnUrl(returnUrl, role)) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    this.navigateByRole(role);
  }

  private navigateByRole(role: RoleTypeEnum): void {
    switch (role) {
      case RoleTypeEnum.ADMIN:
        this.router.navigate(['/admin/dashboard']);
        break;

      case RoleTypeEnum.EMPLOYEE:
        this.router.navigate(['/employee/dashboard']);
        break;

      case RoleTypeEnum.MANAGER:
        this.router.navigate(['/manager/dashboard']);
        break;

      default:
        this.router.navigate(['/login']);
    }
  }

  private canUseReturnUrl(returnUrl: string, role: RoleTypeEnum): boolean {
    if (!returnUrl.startsWith('/') || returnUrl.startsWith('//')) {
      return false;
    }

    return (
      (role === RoleTypeEnum.ADMIN && returnUrl.startsWith('/admin')) ||
      (role === RoleTypeEnum.EMPLOYEE && returnUrl.startsWith('/employee')) ||
      (role === RoleTypeEnum.MANAGER && returnUrl.startsWith('/manager'))
    );
  }
}
 