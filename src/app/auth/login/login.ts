import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { UserModel } from '../../core/models/user.model';
import { AuthStore } from '../store/auth.store';
import { RoleType } from '../../core/models/role.model';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule , RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  submitted : boolean = false;
  loading : boolean = false;
  serverError : string = '';
  passwordVisible :boolean = false;
  
  private fb : FormBuilder= inject(FormBuilder);
  private auth : Auth= inject(Auth);
  private router : Router = inject(Router)
  

  loginForm : FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  
  

  get f() {
    return this.loginForm.controls;
  }

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  async login() {
  this.submitted = true;
  if (this.loginForm.invalid) return;

  const email: string = this.loginForm.controls['email'].value;
  const password: string = this.loginForm.controls['password'].value;

  if (!email || !password) {
    this.loading = false;
    return;
  }

  this.loading = true;

  // wait for login to complete
  const user = await this.auth.login(email, password);

  this.loading = false;

  if (!user) {
    this.router.navigate(['/login']);
    console.error("error validating user");
    return;
  }

  // 
  console.log(user.role)
  if (user.role === RoleType.Admin) {
    this.router.navigate(['/admin/dashboard']);
  }
  else if(user.role === RoleType.Employee){
    this.router.navigate(['/employee/dashboard'])
  }
  else {
    this.router.navigate(['/manager/dashboard'])
  }
}

}
