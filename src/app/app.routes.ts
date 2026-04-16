
import { Route } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard';
import { adminGuard, employeeGuard, managerGuard } from './auth/guards/role-guard';
import { MainShell } from './shared/components/main-shell/main-shell';
export const routes : Route[]=[
    
{
    path:'',
    loadChildren:()=> import('./auth/auth.routes').then(r=>r.authRoutes)
 
},
{
  path: 'admin',
  canActivate: [authGuard, adminGuard],
  component: MainShell,
  loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
}
,
{
  path: 'employee',
  canActivate: [authGuard, employeeGuard],
  component: MainShell,
  loadChildren: () => import('./features/employee/employee.routes').then(m => m.employeeRoutes)
}
,

{
  path: 'manager',
  canActivate: [authGuard, managerGuard],
  component: MainShell,
  loadChildren: () => import('./features/manager/manager.routes').then(m => m.employeeRoutes)
}

]