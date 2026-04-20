import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "../store/auth.store";
import { inject } from "@angular/core";
import { RoleTypeEnum } from "../../core/models/role.model";

export const adminGuard : CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.currentUser;

  if (user?.role !== RoleTypeEnum.Admin) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
export const employeeGuard : CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.currentUser;

  if (user?.role !== RoleTypeEnum.Employee) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
export const managerGuard : CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.currentUser;

  if (user?.role !== RoleTypeEnum.Manager ) {
    router.navigate(['/']);
    return false;
  }

  return true;
};