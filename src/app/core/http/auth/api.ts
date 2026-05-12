import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserModel } from '../../models/user/user.model';
import { Observable} from 'rxjs';
import { LoginRequest } from '../../models/auth/login-request.model';
import { ApiResponse } from '../../models/api/api-reponse.model';
import { environment } from '../../../../environments/environment';
import { LoginResponse } from '../../models/auth/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private http : HttpClient =  inject(HttpClient)
  

 loginUser(requestData: LoginRequest) : Observable<ApiResponse<LoginResponse>>{
  
    return this.http.post<ApiResponse<LoginResponse>>(
      `${environment.apiBaseUrl}/api/auth/login`,
      requestData
    )
}
  
   
}
