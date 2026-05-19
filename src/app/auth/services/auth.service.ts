import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from '../store/auth.store';
import { AuthApi } from '../../core/http/auth/auth-api';
import { LoginRequest } from '../../core/models/auth/login-request.model';
import { LoginResponse } from '../../core/models/auth/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStore: AuthStore = inject(AuthStore);
  private authApi: AuthApi = inject(AuthApi);
  private restorePromise: Promise<LoginResponse | null> | null = null;

  async loginUser(request: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await firstValueFrom(this.authApi.loginUser(request));

      if (!response.success || !response.data) {
        throw new Error('Invalid login response');
      }

      const user = response.data;

      if (
        !(
          user.email &&
          user.role &&
          user.name &&
          user.accessToken &&
          user.refreshToken
        )
      ) {
        throw new Error('Invalid user state.');
      }

      localStorage.setItem('accessToken', user.accessToken);
      localStorage.setItem('refreshToken', user.refreshToken);
      this.authStore.setUser(user);
      return user;
    } catch (err: unknown) {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          throw new Error('Invalid email or password');
        }
        if (err.error?.message) {
          throw new Error(err.error.message);
        }
      }

      if (err instanceof Error) {
        throw err;
      }

      throw new Error('Server error. Please try again.');
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.authStore.clearUser();
  }

  restoreSession(): Promise<LoginResponse | null> {
    if (!this.restorePromise) {
      this.restorePromise = this.restoreSessionInternal().finally(() => {
        this.restorePromise = null;
      });
    }

    return this.restorePromise;
  }

  private async restoreSessionInternal(): Promise<LoginResponse | null> {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken && !refreshToken) {
      this.logout();
      return null;
    }

    if (accessToken) {
      const user = await this.restoreFromCurrentAccessToken();
      

      if (user) {
        console.log(user)
        return user;
      }
    }

    if (!refreshToken) {
      this.logout();
      return null;
    }

    try {
      const response = await firstValueFrom(
        this.authApi.refreshSession(refreshToken)
      );

      if (!response.success || !response.data) {
        throw new Error('Invalid refresh response');
      }

      localStorage.setItem('accessToken', response.data);

      const user = await this.restoreFromCurrentAccessToken();

      if (!user) {
        throw new Error('Unable to restore refreshed session');
      }

      return user;
    } catch {
      this.logout();
      return null;
    }
  }

  private async restoreFromCurrentAccessToken(): Promise<LoginResponse | null> {
    try {
      const response = await firstValueFrom(this.authApi.restoreSession());
      const user = response.data;

      if (!response.success || !this.hasUserContext(user)) {
        return null;
      }

      this.authStore.setUser(user);
      return user;
    } catch {
      return null;
    }
  }

  private hasUserContext(user: LoginResponse | null): user is LoginResponse {
    return !!(user?.email && user.role && user.name);
  }
}
