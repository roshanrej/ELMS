import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { UserModel } from '../../core/models/user.model';
import { AuthStore } from '../store/auth.store';
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
  private authStore : AuthStore = inject(AuthStore)

  loginForm : FormGroup = this.fb.group({
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

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    
    
     const email : string = this.loginForm.controls['email'].value
     const password : string = this.loginForm.controls['password'].value

     if(! email || !password) { 
      this.loading = false; 
      return ;
     } 
     this.loading = true;
     this.auth.login(email, password)// → calling auth service

     const user : UserModel | null = this.authStore.currentUser
     if(!user){
      this.router.navigate(['/login'])
      return console.error("error validating user");
     } 
     // redirecting
    
      this.router.navigate(['/admin/dashboard'])
     


  }

}
