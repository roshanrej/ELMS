import { Route } from "@angular/router";
import { Analytics } from "./pages/analytics/analytics";
import { Approvals } from "./pages/approvals/approvals";
import { Dashboard } from "./pages/dashboard/dashboard";
import { TeamLeaves } from "./pages/team-leaves/team-leaves";

export const employeeRoutes: Route[]=[
 {path:'dashboard', component:Dashboard},
 {path:'approvals', component: Approvals},
 {path:'view-leaves', component: TeamLeaves},
 {path:'leave-analytics', component: Analytics},
]
