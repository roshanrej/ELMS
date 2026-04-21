import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '../../core/models/user.model';
import { AuthStore } from '../store/auth.store';
import { AuthApi } from '../../core/http/auth/api';

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

  private authStore : AuthStore = inject (AuthStore)
  private api : AuthApi = inject (AuthApi)
  

  

async login(email: string, password: string): Promise<UserModel | null> {

  if (!email || !password) {
    console.log("Error on data validation");
    return null;
  }
  const requestData = { email, password };

  try {
    const user = await this.api.loginUser(requestData)
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
   //this.http.post('api/register',newUser) // action returning an observable
   return null
  }
 

  logout() {
    //api call
  
  this.authStore.setUser(null); //ui reflection
   
  }
}

