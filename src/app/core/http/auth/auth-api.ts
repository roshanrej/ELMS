import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SILENT_HTTP_ERROR } from '../http-context.tokens';
import { LoginRequestDTO } from '../../dtos/auth/login-request.dto';
import { LoginResponseDTO, AccessTokenResponseDTO } from '../../dtos/auth/login-response.dto';
import { UserContextDTO } from '../../dtos/user/user.model';
import { ApiResponseDTO } from '../../dtos/api/api-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  loginUser(requestData: LoginRequestDTO): Observable<ApiResponseDTO<LoginResponseDTO>> {
    return this.http.post<ApiResponseDTO<LoginResponseDTO>>(
      `${this.baseUrl}/api/auth/login`,
      requestData
    );
  }

  // Returns current authenticated user context
  getCurrentUser(): Observable<ApiResponseDTO<UserContextDTO>> {
    return this.http.get<ApiResponseDTO<UserContextDTO>>(`${this.baseUrl}/api/auth/me`, {
      context: new HttpContext().set(SILENT_HTTP_ERROR, true),
    });
  }

  refreshSession(refreshToken: string): Observable<ApiResponseDTO<AccessTokenResponseDTO>> {
    return this.http.post<ApiResponseDTO<AccessTokenResponseDTO>>(
      `${this.baseUrl}/api/auth/refresh`,
      { refreshToken },
      { context: new HttpContext().set(SILENT_HTTP_ERROR, true) },
    );
  }

  logoutUser(refreshToken: string): Observable<ApiResponseDTO<null>> {
    return this.http.post<ApiResponseDTO<null>>(
      `${this.baseUrl}/api/auth/logout`,
      { refreshToken }
    );
  }
}
