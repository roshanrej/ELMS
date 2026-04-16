import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "../store/auth.store";
import { inject } from "@angular/core";
import { RoleType } from "../../core/models/role.model";

export const adminGuard : CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.currentUser;

  if (user?.role !== RoleType.Admin) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
export const employeeGuard : CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.currentUser;

  if (user?.role !== RoleType.Employee) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
export const managerGuard : CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.currentUser;

  if (user?.role !== RoleType.Manager ) {
    router.navigate(['/']);
    return false;
  }

  return true;
};