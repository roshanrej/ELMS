import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  if (isTokenlessAuthRequest(req.url)) {
    return next(req);
  }

  const token = localStorage.getItem('accessToken');
  console.log("ACCESS TOKEN", token)

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
  url.includes('/api/auth/login') || url.includes('/api/auth/refresh');
