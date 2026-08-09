import { useState } from 'react';
import { AgencyRole, PermissionString, hasPermission } from '../utils/permissions';

export function usePermission(userRole: AgencyRole = 'AgencyOwner') {
  const [role] = useState<AgencyRole>(userRole);

  const can = (permission: PermissionString | string): boolean => {
    return hasPermission(role, permission);
  };

  return {
    role,
    can,
  };
}

export default usePermission;
