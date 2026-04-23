import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { RoleTypeEnum } from '../../core/types-enums/role-type.enum';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
   console.log('Role GUARD HIT');
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.currentUser;
  const expectedRole = route.data['role'] as RoleTypeEnum;
  console.log(user)
  console.log(expectedRole)
  // ❌ not logged in
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (!expectedRole) {
    return true;
  }

  // ❌ wrong role
  if (user.role !== expectedRole) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
