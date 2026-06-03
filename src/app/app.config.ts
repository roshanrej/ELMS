import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { apiErrorInterceptor } from './core/http/interceptors/api-error-interceptor';
import { jwtInterceptor } from './auth/interceptors/jwt-interceptor';
import { tokenRefreshInterceptor } from './auth/interceptors/token-refresh-interceptor';
import { AuthService } from './auth/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => inject(AuthService).restoreSession()),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, apiErrorInterceptor, tokenRefreshInterceptor])),
  ]
};
