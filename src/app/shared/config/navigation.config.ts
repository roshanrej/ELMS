export interface AppNavItem {
  label: string;
  route: string;
  icon: string;
  exact?: boolean;
}

export const NAVIGATION_BY_ROLE: Record<string, AppNavItem[]> = {
  SUPER_ADMIN: [
    { label: 'Dashboard', route: '/super-admin/dashboard', icon: 'bi-grid', exact: true },
    { label: 'Users', route: '/super-admin/users', icon: 'bi-person-plus', exact: true },
  ],
  ADMIN: [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'bi-grid', exact: true },
    { label: 'Users', route: '/admin/employees', icon: 'bi-people', exact: true },
    { label: 'Teams', route: '/admin/teams', icon: 'bi-diagram-3', exact: true },
    { label: 'Departments', route: '/admin/departments', icon: 'bi-building', exact: true },
    { label: 'Leave Types', route: '/admin/leave-types', icon: 'bi-tags', exact: true },
    { label: 'Leave Policies', route: '/admin/leave-quotas', icon: 'bi-sliders', exact: true },
  ],
  EMPLOYEE: [
    { label: 'Dashboard', route: '/employee/dashboard', icon: 'bi-grid', exact: true },
    { label: 'Apply Leave', route: '/employee/leaves/apply', icon: 'bi-plus-circle', exact: true },
    { label: 'My Leaves', route: '/employee/leaves', icon: 'bi-journal-text', exact: true },
    { label: 'Drafts', route: '/employee/leaves/drafts', icon: 'bi-file-earmark', exact: true },
    { label: 'Leave Balance', route: '/employee/leaves/balance', icon: 'bi-pie-chart', exact: true },
  ],
  MANAGER: [
    { label: 'Dashboard', route: '/manager/dashboard', icon: 'bi-grid', exact: true },
    { label: 'Team Leaves', route: '/manager/team/leaves', icon: 'bi-people', exact: true },
  ],
};

export function getNavigationForRole(role: string | undefined | null): AppNavItem[] {
  if (!role) {
    return [];
  }

  return NAVIGATION_BY_ROLE[role] ?? [];
}