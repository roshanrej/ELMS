import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder,Validators,ReactiveFormsModule, AbstractControlOptions } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule ,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
   private fb = inject(FormBuilder)
  submitted = false;
  loading = false;
  serverError = '';
  passwordVisible = false;
  confirmPasswordVisible = false;


  departments = [ // needs to be retreived from the db on component initialization
    { value: 'hr', label: 'Human Resources' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'sales', label: 'Sales' },
    { value: 'finance', label: 'Finance' },
    { value: 'it', label: 'IT' }
  ];

  registerForm = this.fb.group({
  username: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  department: ['', Validators.required],
  password: ['', Validators.required,Validators.minLength(8)],
  confirmPassword: ['', Validators.required, Validators.minLength(8)]
} );

passwordCheck(): boolean {
  return this.f['password'].value === this.f['confirmPassword'].value;
}

  get f() {
    return this.registerForm.controls;
  }

  togglePassword(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.registerForm.invalid) return;

    this.loading = true;

    console.log(this.registerForm.value);

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
