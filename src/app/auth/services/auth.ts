import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from '../../core/models/user.model';
import { AuthStore } from '../store/auth.store';






@Injectable({
  providedIn: 'root',
})
export class Auth {
  
  private router = inject(Router)
  private authStore = inject (AuthStore)


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
    //api call logged out true or false or with neccessary data
  this.authStore.setUser(null); // if true
  this.router.navigate(['/login']); // true navigate 

}
}

