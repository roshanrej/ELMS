import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Single-responsibility auth interceptor per architecture spec:
 * - Catch 401
 * - Refresh access token using refresh token
 * - Retry original request
 * - Logout + redirect on refresh failure
 */
let refreshPromise: Promise<string | null> | null = null;

export const tokenRefreshInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuthRecoveryRequest = (url: string): boolean =>
    url.includes('/api/auth/login') ||
    url.includes('/api/auth/register') ||
    url.includes('/api/auth/refresh') ||
    url.includes('/api/auth/me');

  if (isAuthRecoveryRequest(req.url)) {
    return next(req);
  }

  const refreshToken = localStorage.getItem('refreshToken');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && refreshToken) {
        refreshPromise ??= firstValueFrom(authService.refreshAccessToken(refreshToken))
          .then((response) => {
            const newAccessToken = response.success ? response.data?.accessToken : null;
            if (newAccessToken) {
              localStorage.setItem('accessToken', newAccessToken);
            }
            return newAccessToken ?? null;
          })
          .finally(() => {
            refreshPromise = null;
          });
        return from(refreshPromise).pipe(
          switchMap((newAccessToken) => {
            if (!newAccessToken) {
              return handleAuthFailure(authService, router, 'Refresh response invalid');
            }

            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newAccessToken}` }
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            return handleAuthFailure(authService, router, refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};

function handleAuthFailure(authService: AuthService, router: Router, error: unknown) {
  authService.logout();
  router.navigate(['/login']);
  return throwError(() => error);
}
