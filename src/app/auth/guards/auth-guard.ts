import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.currentUser;

  if (!user) {
    router.navigate(['/login']);
    return false;
  }
  else{
    // check for valid session and reroute based on role
  }

  return true;
};