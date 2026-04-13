import { AdminLayout } from "./layout/admin-layout/admin-layout";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Departments } from "./pages/departments/departments";
import { Employees } from "./pages/employees/employees";
import { LeaveQuotas } from "./pages/leave-quotas/leave-quotas";

export const adminRoutes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'employees', component: Employees },
      { path: 'departments', component: Departments },
      { path: 'leave-quotas', component: LeaveQuotas }
    ]
  }
];