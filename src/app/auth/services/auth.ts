import { Injectable } from '@angular/core';



export interface UserModel{
  id : number, // system internal id which cant be recreated to preserve history and identity
  email : string //user facing identity which is unique and enforce by the db
  deptId : number, // foreign key many to one
  passwordHash : string, // stored passwordHash to validate user 
  roleId : number // system enforces permissions and exposure to services for a user
}



@Injectable({
  providedIn: 'root',
})
export class Auth {
  login(){
    //api call and return statement as a response

  }
  register(newUser : Omit<UserModel,"id">) : UserModel | null {
    //email uniqueness and enforcing default role on post
   return null
  }
}
