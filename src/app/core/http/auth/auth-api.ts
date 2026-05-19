import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable} from 'rxjs';
import { LoginRequest } from '../../models/auth/login-request.model';
import { ApiResponse } from '../../models/api/api-response.model';
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
restoreSession(): Observable<ApiResponse<LoginResponse>>{
  return this.http.get<ApiResponse<LoginResponse>>(`${environment.apiBaseUrl}/api/auth/me`)
  }

refreshSession(refreshToken: string): Observable<ApiResponse<string>> {
  return this.http.post<ApiResponse<string>>(
    `${environment.apiBaseUrl}/api/auth/refresh`,
    { refreshToken }
  );
}
  
   
}
