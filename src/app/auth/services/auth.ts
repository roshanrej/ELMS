import { inject, Injectable } from '@angular/core';
import { UserModel } from '../../core/models/user/user.model';
import { AuthStore } from '../store/auth.store';
import { AuthApi } from '../../core/http/auth/api';
import { LoginRequest } from '../../core/models/auth/login-request.model';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStore: AuthStore = inject(AuthStore);
  private authApi: AuthApi = inject(AuthApi);
  private router: Router = inject(Router);

  async loginUser(request: LoginRequest): Promise<UserModel> {
    try {
      const res = await firstValueFrom(this.authApi.loginUser(request));

      if (!res.success || !res.data || !res.token) {
        throw new Error('Invalid login response');
      }

      if (!(res.data.id && res.data.email && res.data.role && res.data.name)) {
        throw new Error('Invalid user state.');
      }

      // commit auth state
      localStorage.setItem('token', res.token);
      this.authStore.setUser(res.data);

      return res.data; // user
    } catch (err: any) {
      if (err instanceof HttpErrorResponse) {
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
