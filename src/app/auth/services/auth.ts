import { inject, Injectable } from '@angular/core';
import { UserModel } from '../../core/models/user/user.model';
import { AuthStore } from '../store/auth.store';
import { AuthApi } from '../../core/http/auth/api';
import { LoginRequest } from '../../core/models/auth/login-request.model';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../core/models/api/api-reponse.model';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private authStore: AuthStore = inject(AuthStore)
  private authApi: AuthApi = inject(AuthApi)
  private router: Router = inject(Router)




 async loginUser(request: LoginRequest): Promise<UserModel> {
  try {
    const res = await firstValueFrom(
      this.authApi.loginUser(request) // ✅ already returns Observable<ApiResponse<UserModel>>
    );

    if (!res.success || !res.data) {
      throw new Error('Invalid login response');
    }

    localStorage.setItem('token', res.token!);

    return res.data;

  } catch (err: any) {
    if (err.status === 401) {
      throw new Error('Invalid email or password');
    }

    throw new Error('Server error. Please try again.');
  }
}





  logout() {
    //api call

    localStorage.removeItem('token')
    this.authStore.setUser(null)
    this.router.navigate(['/login'])//ui reflection

  }
}

