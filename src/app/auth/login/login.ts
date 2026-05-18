import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { RoleTypeEnum } from '../../core/types-enums/role-type.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  submitted : boolean = false;
  loading : boolean = false;
  serverError : string = '';
  passwordVisible  : boolean = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get f() {
    return this.loginForm.controls;
  }

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }


  
  async login() {
  this.submitted = true;
  this.serverError = '';

  if (this.loginForm.invalid) return;

  try {
    this.loading = true;
    const user = await this.authService.loginUser(this.loginForm.value);
    
    this.navigateAfterLogin(user.role);
  } catch (error: any) {
    // Extract the message you 'threw' in the service
    this.serverError = error.message || 'Server error';
    
    // Better UX: keep email, clear password
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

  private navigateByRole( role: RoleTypeEnum): void {
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

  private extractErrorMessage(error: any): string {
    if (error?.error?.message) return error.error.message;
    if (error?.message) return error.message;
    return 'Something went wrong. Please try again.';
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
