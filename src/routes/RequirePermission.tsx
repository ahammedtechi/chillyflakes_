import React from 'react';
import { Outlet } from 'react-router-dom';
import { usePermission } from '../features/admin/hooks/usePermission';
import { AdminPermissionDeniedPage } from '../pages/AdminPermissionDeniedPage';
import type { AdminModule, AdminAction } from '../types/admin';

interface RequirePermissionProps {
  module: AdminModule;
  action?: AdminAction;
  children?: React.ReactNode;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  module,
  action = 'view',
  children,
}) => {
  const { hasPermission } = usePermission();

  if (!hasPermission(module, action)) {
    return <AdminPermissionDeniedPage moduleName={module.replace('_', ' ')} actionName={action} />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RequirePermission;
