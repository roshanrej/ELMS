import { Routes } from "@angular/router";
import { AdminLayout } from "./layout/admin-layout/admin-layout";
import { Analytics } from "./pages/analytics/analytics";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Departments } from "./pages/departments/departments";
import { Employees } from "./pages/employees/employees";
import { LeaveQuotas } from "./pages/leave-quotas/leave-quotas";

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'analytics', component: Analytics },
      { path: 'employees', component: Employees },
      { path: 'departments', component: Departments },
      { path: 'leave-quotas', component: LeaveQuotas }
    ]
  }
];
