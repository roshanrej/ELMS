import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '../../core/models/user.model';
import { AuthStore } from '../store/auth.store';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

 export enum Role {
    Admin="ADMIN",
    Manager = "Manager",
    Employee = "EMPLOYEE"
}
export enum Department{
    IT="IT"
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  
  private router:Router = inject(Router)
  private authStore : AuthStore = inject (AuthStore)
  private http : HttpClient =  inject(HttpClient)
  

  

async login(email: string, password: string): Promise<UserModel | null> {

  if (!email || !password) {
    console.log("Error on data validation");
    return null;
  }

  const requestData = { email, password };

  try {
    const user = await firstValueFrom(
      this.http.post<UserModel>('http://localhost:3000/auth/login', requestData)
    );

    console.log('[SERVICE] LOGIN USER:', user);

    if (user) {
      this.authStore.setUser(user);
    }

    return user;

  } catch (error) {
    console.log('[SERVICE] login failed', error);
    return null;
  }
}
  register(newUser : Omit<UserModel,"id">) : UserModel | null {
    //api service
   this.http.post('api/register',newUser) // action returning an observable
   return null
  }
 

  logout() {
    //api call
  
  this.authStore.setUser(null); //ui reflection
   
  }
}

