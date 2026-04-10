import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule , RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  submitted = false;
  loading = false;
  serverError = '';
  passwordVisible = false;
  
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  
  understandFormControlandBuilding(){
   const controls = this.loginForm.controls
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) return;
    this.loading = true;
    // later → call auth service
  }

}
