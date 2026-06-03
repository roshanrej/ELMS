import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStore } from '../store/auth.store';
import { UserContextDTO } from '../../core/dtos/user/user.model';

export const authGuard: CanActivateFn = async (_route, state) => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authStore.currentUser) {
    return true;
  }

  const restoredUser : UserContextDTO | null = await authService.restoreSession();

  if (restoredUser) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
