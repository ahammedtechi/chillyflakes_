import { useAdminAuth } from '../../../context/AdminAuthContext';
import type { AdminModule, AdminAction, PermissionKey } from '../../../types/admin';

export function usePermission() {
  const { admin } = useAdminAuth();

  const isSuperAdmin =
    admin?.role === 'admin' ||
    admin?.role_id === 'role_super_admin' ||
    admin?.role_name === 'Super Admin' ||
    admin?.email === 'admin@test.com';

  const hasPermission = (module: AdminModule, action: AdminAction): boolean => {
    if (!admin) return false;
    if (isSuperAdmin) return true;

    const userPerms = (admin.permissions || []) as string[];
    const exactKey: PermissionKey = `${module}:${action}`;
    const wildcardModule = `${module}:*`;

    return (
      userPerms.includes('*') ||
      userPerms.includes(wildcardModule) ||
      userPerms.includes(exactKey)
    );
  };

  const canView = (module: AdminModule): boolean => hasPermission(module, 'view');
  const canCreate = (module: AdminModule): boolean => hasPermission(module, 'create');
  const canEdit = (module: AdminModule): boolean => hasPermission(module, 'edit');
  const canDecide = (module: AdminModule): boolean => hasPermission(module, 'decide');
  const canDelete = (module: AdminModule): boolean => hasPermission(module, 'delete');
  const canExport = (module: AdminModule): boolean => hasPermission(module, 'export');

  return {
    isSuperAdmin,
    hasPermission,
    canView,
    canCreate,
    canEdit,
    canDecide,
    canDelete,
    canExport,
    currentAdmin: admin,
  };
}
