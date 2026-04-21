import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { firstValueFrom, Observable } from 'rxjs';
import { LeaveModel } from '../../models/leave-model';
@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private http : HttpClient =  inject(HttpClient)


  async loginUser(requestData:{email:string, password :string}): Promise<UserModel|null> {
    
    const user = await firstValueFrom(
    this.http.post<UserModel>('http://localhost:3000/auth/login', requestData)

    );
    return user
  }
  
   
}
