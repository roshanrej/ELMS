import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Pure token attachment interceptor.
 * Token refresh + 401 handling lives in tokenRefreshInterceptor.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  if (isTokenlessAuthRequest(req.url)) {
    return next(req);
  }

  const token = localStorage.getItem('accessToken');

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};

const isTokenlessAuthRequest = (url: string): boolean =>
  url.includes('/api/auth/login') || url.includes('/api/auth/refresh') || url.includes('/api/auth/register');
