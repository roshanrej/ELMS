import { Route } from "@angular/router";
import { AdminAnalyticsPage } from "./pages/analytics/analytics";
import { AdminDashboardPage } from "./pages/dashboard/dashboard";
import { DepartmentsPage } from "./pages/departments/departments";
import { EmployeesPage } from "./pages/employees/employees";
import { LeaveQuotasPage } from "./pages/leave-quotas/leave-quotas";



export const adminRoutes : Route[]=[
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', component:AdminDashboardPage},
    {path: 'employees', component:EmployeesPage},
    {path: 'departments', component:DepartmentsPage},
    {path: 'leave-quotas', component: LeaveQuotasPage},
    {path: 'analytics', component:AdminAnalyticsPage},
]
