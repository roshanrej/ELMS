import { Route } from '@angular/router';
import { adminDepartmentsResolver } from '../admin/resolvers/departments.resolver';
import { SuperAdminDashboardPage } from './pages/dashboard/dashboard';
import { SuperAdminUsersPage } from './pages/users/users';
import { superAdminRolesResolver } from './resolvers/roles.resolver';
import { superAdminUsersResolver } from './resolvers/users.resolver';

export const superAdminRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: SuperAdminDashboardPage },
  {
    path: 'users',
    component: SuperAdminUsersPage,
    resolve: {
      users: superAdminUsersResolver,
      departments: adminDepartmentsResolver,
      roles: superAdminRolesResolver,
    },
  },
];