
import { Route } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard';
import { roleGuard } from './auth/guards/role-guard';
import { MainShell } from './shared/components/main-shell/main-shell';
import { RoleTypeEnum } from './core/types-enums/role-type.enum';

export const routes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes').then(r => r.authRoutes),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: RoleTypeEnum.ADMIN },
    component: MainShell,
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
  },
  {
    path: 'employee',
    canActivate: [authGuard, roleGuard],
    data: { role: RoleTypeEnum.EMPLOYEE },
    component: MainShell,
    loadChildren: () => import('./features/employee/employee.routes').then(m => m.employeeRoutes),
  },
  {
    path: 'manager',
    canActivate: [authGuard, roleGuard],
    data: { role: RoleTypeEnum.MANAGER },
    component: MainShell,
    loadChildren: () => import('./features/manager/manager.routes').then(m => m.managerRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
