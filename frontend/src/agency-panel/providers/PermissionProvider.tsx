import React, { createContext, useContext, useState } from 'react';
import { AgencyRole, PermissionString, hasPermission } from '../utils/permissions';

interface PermissionContextType {
  role: AgencyRole;
  setRole: (role: AgencyRole) => void;
  can: (permission: PermissionString | string) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode; initialRole?: AgencyRole }> = ({
  children,
  initialRole = 'AgencyOwner',
}) => {
  const [role, setRole] = useState<AgencyRole>(initialRole);

  const can = (permission: PermissionString | string): boolean => {
    return hasPermission(role, permission);
  };

  return (
    <PermissionContext.Provider value={{ role, setRole, can }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionContext = () => {
  const ctx = useContext(PermissionContext);
  if (!ctx) {
    throw new Error('usePermissionContext must be used within PermissionProvider');
  }
  return ctx;
};
