import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const authGuard: CanActivateFn = () => {
   console.log('AUTH GUARD HIT');
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const token = localStorage.getItem('accessToken');
  const user = authStore.currentUser;

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Optional: if token exists but store is empty → allow (rehydration will fix)
  return true;
};