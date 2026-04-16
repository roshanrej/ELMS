import { Route } from "@angular/router";
import { ApplyLeave } from "./pages/apply-leave/apply-leave";
import { Dashboard } from "./pages/dashboard/dashboard";
import { LeaveBalance } from "./pages/leave-balance/leave-balance";
import { MyLeaves } from "./pages/my-leaves/my-leaves";

export const employeeRoutes: Route[]=[
 {path:'dashboard', component:Dashboard},
 {path:'request-leave', component: ApplyLeave},
 {path:'leaves', component: MyLeaves},
 {path:'leave-balance', component: LeaveBalance}
]
