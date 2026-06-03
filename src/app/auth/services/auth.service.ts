import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthStore } from '../store/auth.store';
import { AuthApi } from '../../core/http/auth/auth-api';
import { LoginRequestDTO } from '../../core/dtos/auth/login-request.dto';
import { AccessTokenResponseDTO } from '../../core/dtos/auth/login-response.dto';
import { UserContextDTO } from '../../core/dtos/user/user.model';
import { ApiResponseDTO } from '../../core/dtos/api/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStore: AuthStore = inject(AuthStore);
  private authApi: AuthApi = inject(AuthApi);
  private restorePromise: Promise<UserContextDTO | null> | null = null;
  private sessionInitialized = false;

  async loginUser(request: LoginRequestDTO): Promise<UserContextDTO> {
    try {
      const response = await firstValueFrom(this.authApi.loginUser(request));

      if (!response.success || !response.data) {
        throw new Error('Invalid login response');
      }

      const { user, accessToken, refreshToken } = response.data;

      if (!user || !user.email || !user.role || !accessToken || !refreshToken) {
        throw new Error('Invalid user state from backend.');
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      this.authStore.setUser(user);
      this.sessionInitialized = true;
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

  refreshAccessToken(refreshToken: string): Observable<ApiResponseDTO<AccessTokenResponseDTO>> {
    return this.authApi.refreshSession(refreshToken);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.authStore.clearUser();
    this.sessionInitialized = true;
  }

  restoreSession(): Promise<UserContextDTO | null> {
    if (this.authStore.currentUser) {
      this.sessionInitialized = true;
      return Promise.resolve(this.authStore.currentUser);
    }

    if (this.sessionInitialized) {
      return Promise.resolve(null);
    }

    if (!this.restorePromise) {
      this.restorePromise = this.restoreSessionInternal().finally(() => {
        this.sessionInitialized = true;
        this.restorePromise = null;
      });
    }
    return this.restorePromise;
  }

  private async restoreSessionInternal(): Promise<UserContextDTO | null> {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken && !refreshToken) {
      this.logout();
      return null;
    }

    // Try current access token first via /me
    if (accessToken) {
      const user = await this.restoreFromCurrentAccessToken();
      if (user) {
        return user;
      }
    }

    if (!refreshToken) {
      this.logout();
      return null;
    }

    try {
      const response = await firstValueFrom(this.authApi.refreshSession(refreshToken));

      if (!response.success || !response.data?.accessToken) {
        throw new Error('Invalid refresh response');
      }

      localStorage.setItem('accessToken', response.data.accessToken);

      // After refresh, fetch fresh user context
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

  private async restoreFromCurrentAccessToken(): Promise<UserContextDTO | null> {
    try {
      const response = await firstValueFrom(this.authApi.getCurrentUser());

      if (!response.success || !response.data) {
        return null;
      }

      const user: UserContextDTO = response.data;
      this.authStore.setUser(user);
      return user;
    } catch {
      return null;
    }
  }

  getCurrentUser(): UserContextDTO | null {
    return this.authStore.currentUser;
  }
}
