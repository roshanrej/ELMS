import { Route } from '@angular/router';
import { ManagerDashboardPage } from './pages/dashboard/dashboard';
import { TeamLeavesPage } from './pages/team-leaves/team-leaves';
import { managerDashboardDetailsResolver } from './resolvers/manager-dashboard-details.resolver';
import { managerOwnedLeavesResolver } from './resolvers/manager-owned-leave-requests.resolver';

export const managerRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: ManagerDashboardPage,
    resolve: {
      managerDashboardDetails: managerDashboardDetailsResolver,
    },
  },
  { path: 'team/leaves', component: TeamLeavesPage,
    resolve:{
      teamLeaves : managerOwnedLeavesResolver
    }
   },
];
