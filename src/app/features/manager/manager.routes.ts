import { Route } from "@angular/router";
import { ManagerAnalyticsPage } from "./pages/analytics/analytics";
import { ManagerApprovalsPage } from "./pages/approvals/approvals";
import { ManagerDashboardPage } from "./pages/dashboard/dashboard";
import { TeamLeavesPage } from "./pages/team-leaves/team-leaves";

export const managerRoutes: Route[]=[
 {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
 {path: 'dashboard', component:ManagerDashboardPage},
 {path: 'approvals', component: ManagerApprovalsPage},
 {path: 'view-leaves', component: TeamLeavesPage},
 {path: 'leave-analytics', component: ManagerAnalyticsPage},
]
