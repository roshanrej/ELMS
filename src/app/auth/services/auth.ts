import { inject, Injectable } from '@angular/core';
import { UserModel } from '../../core/models/user/user.model';
import { AuthStore } from '../store/auth.store';
import { AuthApi } from '../../core/http/auth/api';
import { LoginRequest } from '../../core/models/auth/login-request.model';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginResponse } from '../../core/models/auth/login-response.model';
import { ApiResponse } from '../../core/models/api/api-reponse.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStore: AuthStore = inject(AuthStore);
  private authApi: AuthApi = inject(AuthApi);
  private router: Router = inject(Router);

  async loginUser(request: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await firstValueFrom(this.authApi.loginUser(request));

      if (!response.success || !response.data ) {
        throw new Error('Invalid login response');
      }

      if (!( response.data.email && response.data.role && response.data.name && response.data.accessToken && response.data.refreshToken)) {
        throw new Error('Invalid user state.');
      }

      // commit auth state
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      console.log(response)
      this.authStore.setUser(response.data);

      return response.data; // user
    } catch (err: any) {
      if (err instanceof HttpErrorResponse) {
        console.log(err)
        if (err?.status === 401) {
          throw new Error('Invalid email or password');
        }

        if (err?.error?.message) {
          throw new Error(err.error.message);
        }
      }

      throw new Error('Server error. Please try again.');
    }
  }

  logout() {
    //api call

    localStorage.removeItem('token');
    this.authStore.setUser(null);
    this.router.navigate(['/login']); //ui reflection
  }
}
