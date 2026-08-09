// ─── Super Admin Panel Navigation Constants ──────────────────────────────────

export interface AdminNavItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  isDisabled?: boolean;
}

export interface AdminNavSection {
  title?: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/admin/dashboard',
        iconName: 'LayoutDashboard',
      },
    ],
  },
  {
    title: 'AGENCY MANAGEMENT',
    items: [
      {
        id: 'agency-apps',
        label: 'Agency Applications',
        path: '/admin/agencies',
        iconName: 'Building2',
      },
      {
        id: 'all-agencies',
        label: 'All Agencies',
        path: '/admin/agencies',
        iconName: 'Users',
      },
    ],
  },
  {
    title: 'PLATFORM OVERVIEW',
    items: [
      { id: 'users', label: 'Users', path: '#', iconName: 'User', isDisabled: true },
      { id: 'bookings', label: 'Bookings', path: '#', iconName: 'Calendar', isDisabled: true },
      { id: 'payments', label: 'Payments', path: '#', iconName: 'CreditCard', isDisabled: true },
      { id: 'reports', label: 'Reports', path: '#', iconName: 'BarChart2', isDisabled: true },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'activity', label: 'Activity Logs', path: '#', iconName: 'Clock', isDisabled: true },
      { id: 'admin-users', label: 'Admin Users', path: '#', iconName: 'Shield', isDisabled: true },
      { id: 'settings', label: 'Settings', path: '/admin/settings', iconName: 'Settings', isDisabled: false },
    ],
  },
];
