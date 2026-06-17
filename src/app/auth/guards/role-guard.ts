import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStore } from '../store/auth.store';

/**
 * ARCHITECTURAL NOTE:
 * This guard should ideally be data-driven from backend.
 * For now, it checks user role against route metadata.
 * Backend is the source of truth for which roles can access which routes.
 */
export const roleGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state
) => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authStore.currentUser ?? await authService.restoreSession();
  const requiredRole = route.data['requiredRole'] as string;

  if (!user) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  if (!requiredRole || user.role === requiredRole) {
    return true;
  }

  return router.createUrlTree([dashboardForRole(user.role)]);
};

function dashboardForRole(role: string): string {
  const dashboardMap: Record<string, string> = {
    SUPER_ADMIN: '/super-admin/dashboard',
    ADMIN: '/admin/dashboard',
    EMPLOYEE: '/employee/dashboard',
    MANAGER: '/manager/dashboard',
  };

  return dashboardMap[role] ?? '/login';
}
