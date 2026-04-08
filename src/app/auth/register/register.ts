import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder,Validators,ReactiveFormsModule } from '@angular/forms';
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
  


  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  
  get f() {
    return this.registerForm.controls;
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
