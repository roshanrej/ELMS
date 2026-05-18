import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { RoleTypeEnum } from '../../core/types-enums/role-type.enum';
import { AuthService } from '../services/auth';
import { AuthStore } from '../store/auth.store';

export const roleGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state
) => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authStore.currentUser ?? await authService.restoreSession();
  const expectedRole = route.data['role'] as RoleTypeEnum;

  if (!user) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  if (!expectedRole || user.role === expectedRole) {
    return true;
  }

  return router.createUrlTree(['/']);
};
