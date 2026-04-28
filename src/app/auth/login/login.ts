import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { RoleTypeEnum } from '../../core/types-enums/role-type.enum';
import { LoginRequest } from '../../core/models/auth/login-request.model';
import { UserModel } from '../../core/models/user/user.model';

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
    this.navigateByRole(user);
  } catch (error: any) {
    // Extract the message you 'threw' in the service
    this.serverError = error.message || 'Server error';
    
    // Better UX: keep email, clear password
    this.loginForm.get('password')?.reset();
  } finally {
    this.loading = false;
  }
}


  private navigateByRole(user: UserModel): void {
    switch (user.role) {
      case RoleTypeEnum.Admin:
        this.router.navigate(['/admin/dashboard']);
        break;

      case RoleTypeEnum.Employee:
        this.router.navigate(['/employee/dashboard']).then(res => {
  console.log('Navigation success:', res);
});
        break;

      case RoleTypeEnum.Manager:
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
}