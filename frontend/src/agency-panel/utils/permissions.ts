// ─── Global Foundation: Role-Based Access Control (RBAC) Permissions Matrix ───

export type AgencyRole =
  | 'AgencyOwner'
  | 'AgencyManager'
  | 'TripHost'
  | 'FinanceManager'
  | 'OperationsStaff';

export type PermissionModule =
  | 'dashboard'
  | 'packages'
  | 'bookings'
  | 'trips'
  | 'travelers'
  | 'finance'
  | 'analytics'
  | 'crm'
  | 'reviews'
  | 'messages'
  | 'profile'
  | 'settings'
  | 'vehicles'
  | 'team';

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'export'
  | 'assign';

/**
 * Format: "module.action" (e.g. "package.edit", "finance.view", "trip.assign")
 */
export type PermissionString = `${PermissionModule}.${PermissionAction}` | `${PermissionModule}.*`;

const ROLE_PERMISSIONS: Record<AgencyRole, string[]> = {
  AgencyOwner: ['*'], // Full access to everything
  AgencyManager: [
    'dashboard.view',
    'packages.*',
    'bookings.*',
    'trips.*',
    'travelers.*',
    'finance.view',
    'analytics.view',
    'crm.*',
    'reviews.*',
    'messages.*',
    'profile.view',
    'profile.edit',
    'settings.view',
    'vehicles.*',
    'team.view',
    'team.assign',
  ],
  TripHost: [
    'dashboard.view',
    'trips.view',
    'trips.edit',
    'travelers.view',
    'travelers.edit',
    'messages.*',
    'reviews.view',
  ],
  FinanceManager: [
    'dashboard.view',
    'finance.*',
    'analytics.*',
    'bookings.view',
    'bookings.approve',
    'bookings.export',
  ],
  OperationsStaff: [
    'dashboard.view',
    'bookings.view',
    'trips.view',
    'vehicles.view',
    'travelers.view',
    'messages.view',
    'messages.create',
  ],
};

export const hasPermission = (
  role: AgencyRole,
  permission: PermissionString | string
): boolean => {
  const rolePerms = ROLE_PERMISSIONS[role] || [];
  if (rolePerms.includes('*')) return true;

  if (rolePerms.includes(permission)) return true;

  const [module] = permission.split('.');
  if (rolePerms.includes(`${module}.*`)) return true;

  return false;
};
