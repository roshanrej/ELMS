import { Route } from '@angular/router';
import { ApplyLeavePage } from './pages/apply-leave/apply-leave';
import { EmployeeDashboardPage } from './pages/dashboard/dashboard';
import { LeaveBalancePage } from './pages/leave-balance/leave-balance';
import { MyLeavesPage } from './pages/my-leaves/my-leaves';
import { employeeLeavesResolver } from './resolvers/employee-leaves.resolver';
import { leaveBalancesResolver } from './resolvers/leave-balances.resolver';
import { leaveTypesResolver } from './resolvers/leave-types.resolver';
export const employeeRoutes: Route[] = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: 'dashboard',
    component: EmployeeDashboardPage,
  },
  {path: 'leaves', component: MyLeavesPage, resolve: { leaveTypes: leaveTypesResolver }},
  {path: 'leaves/apply', component: ApplyLeavePage, resolve: { leaves: employeeLeavesResolver, leaveTypes: leaveTypesResolver, leaveBalances: leaveBalancesResolver}},
  {
    path: 'leaves/balance',
    component: LeaveBalancePage,
    resolve: { leaveBalances: leaveBalancesResolver },
  },
  {
    path: 'leaves/drafts',
    component: MyLeavesPage,
    resolve: { leaveTypes: leaveTypesResolver },
    data: { mode: 'draft' },
  },
];
