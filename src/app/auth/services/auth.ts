import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '../../core/models/user.model';
import { AuthStore } from '../store/auth.store';
import { HttpClient } from '@angular/common/http';






@Injectable({
  providedIn: 'root',
})
export class Auth {
  
  private router:Router = inject(Router)
  private authStore : AuthStore = inject (AuthStore)
  private http : HttpClient =  inject(HttpClient)


  login( email : string, password : string ){
    //api call and return statement as a response
    const user:UserModel | null = this.validateUser(email,password) 
    this.authStore.setUser(user)//population of auth store
    console.log('LOGIN USER:', user); 
    // user identity and permission based navigation at the login component => utilizing auth.store.ts
    // object
    
  }
  register(newUser : Omit<UserModel,"id">) : UserModel | null {
    //email uniqueness and enforcing default role on post
   return null
  }
  validateUser(email : string, password : string):UserModel|null {
    // api contract and backend call and key value utilization
    // for json data retrieval
    const userData : UserModel ={id : 1,
                                email : 'admin@yahoo.com',
                                name : 'Rosh',
                                deptId : 2, 
                                passwordHash : 'admin123', 
                                roleId : 1 } // api response after call
    return (email === userData.email && password === userData.passwordHash) ?  userData : null;
    }

  logout() {
    //api call
  
  this.authStore.setUser(null); //ui reflection
   
  }
}

