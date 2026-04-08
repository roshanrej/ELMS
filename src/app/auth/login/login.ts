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
   
  private fb = inject(FormBuilder); // modern way to inject services in Angular


  loginForm = this.fb.group({
     email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]]
  });

  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
  this.submitted = true;

  if (this.loginForm.invalid) return;

  this.loading = true;

  // later → call auth service
}
}
