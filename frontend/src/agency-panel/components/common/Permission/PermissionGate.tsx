import React from 'react';
import { PermissionString, AgencyRole, hasPermission } from '../../../utils/permissions';
import { usePermissionContext } from '../../../providers/PermissionProvider';

export interface PermissionGateProps {
  permission: PermissionString | string;
  userRole?: AgencyRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  userRole,
  children,
  fallback = null,
}) => {
  let isAllowed = false;

  try {
    const ctx = usePermissionContext();
    isAllowed = ctx.can(permission);
  } catch (e) {
    const activeRole = userRole || 'AgencyOwner';
    isAllowed = hasPermission(activeRole, permission);
  }

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGate;
