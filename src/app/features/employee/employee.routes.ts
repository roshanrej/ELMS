import { Route } from '@angular/router';

import { ApplyLeavePage } from './pages/apply-leave/apply-leave';
import { EmployeeDashboardPage } from './pages/dashboard/dashboard';
import { LeaveBalancePage } from './pages/leave-balance/leave-balance';
import { MyLeavesPage } from './pages/my-leaves/my-leaves';

import { employeeLeaveRequestsResolver , employeeActiveLeaveRequestsResolver} from './resolvers/employee-leave-requests.resolver';
import { employeeLeaveDraftsResolver } from './resolvers/employee-leave-drafts.resolver';
import { employeeLeaveBalancesResolver } from './resolvers/leave-balances.resolver';
import { leavePoliciesResolver } from './resolvers/leave-policies.resolver';

export const employeeRoutes: Route[] = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    component: EmployeeDashboardPage,
    resolve: {
      leaveRequests: employeeActiveLeaveRequestsResolver,
      leaveBalances: employeeLeaveBalancesResolver
    }
  },

  {
    path: 'leaves',
    component: MyLeavesPage,

    resolve: {
      leaves: employeeLeaveRequestsResolver
    },

    data: {
      mode: 'submitted'
    }
  },

  {
    path: 'leaves/drafts',
    component: MyLeavesPage,

    resolve: {
      leaves: employeeLeaveDraftsResolver
    },

    data: {
      mode: 'draft'
    }
  },

  {
    path: 'leaves/apply',
    component: ApplyLeavePage,

    resolve: {
      leavePolicies: leavePoliciesResolver,
      leaveBalances: employeeLeaveBalancesResolver
    }
  },

  {
    path: 'leaves/balance',
    component: LeaveBalancePage,

    resolve: {
      leaveBalances: employeeLeaveBalancesResolver
    }
  }
];