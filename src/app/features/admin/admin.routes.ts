import { Route } from "@angular/router";
import { Analytics } from "./pages/analytics/analytics";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Departments } from "./pages/departments/departments";
import { Employees } from "./pages/employees/employees";
import { LeaveQuotas } from "./pages/leave-quotas/leave-quotas";



export const adminRoutes : Route[]=[
    {path: 'departments', component:Departments},
    {path:'analytics', component:Analytics},
    {path:'employees', component:Employees},
    {path:'leave-quotas', component: LeaveQuotas},
    {path:'dashboard', component:Dashboard}
]
