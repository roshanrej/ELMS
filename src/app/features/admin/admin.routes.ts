import { Route } from "@angular/router";
import { AdminDashboardPage } from "./pages/dashboard/dashboard";
import { DepartmentsPage } from "./pages/departments/departments";
import { EmployeesPage } from "./pages/employees/employees";
import { LeaveQuotasPage } from "./pages/leave-quotas/leave-quotas";
import { TeamManagementPage } from "./pages/teams/teams";
import { LeaveTypesPage } from "./pages/leave-types/leave-types";
import { adminTeamsResolver } from "./resolvers/teams.resolver";
import { adminLeaveTypesResolver } from "./resolvers/leave-types.resolver";
import { adminEmployeesResolver } from "./resolvers/employees.resolver";
import { adminDepartmentsResolver } from "./resolvers/departments.resolver";
import { adminLeavePoliciesResolver } from "./resolvers/leave-policies.resolver";

export const adminRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: AdminDashboardPage },
  {
    path: 'employees',
    component: EmployeesPage,
    resolve: {
      employees: adminEmployeesResolver,
      teams: adminTeamsResolver,
    },
  },
  {
    path: 'departments',
    component: DepartmentsPage,
    resolve: { departments: adminDepartmentsResolver },
  },
  {
    path: 'teams',
    component: TeamManagementPage,
    resolve: {
      teams: adminTeamsResolver,
    },
  },
  {
    path: 'leave-quotas',
    component: LeaveQuotasPage,
    resolve: {
      leavePolicies: adminLeavePoliciesResolver,
      leaveTypes: adminLeaveTypesResolver,
    },
  },
  {
    path: 'leave-types',
    component: LeaveTypesPage,
    resolve: {
      leaveTypes: adminLeaveTypesResolver,
    },
  },
];
