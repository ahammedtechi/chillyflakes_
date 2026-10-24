import { useQuery } from '@tanstack/react-query';
import { getAdminAuditLogs, type AdminAuditLogParams } from '../../../api/admin';

export const ADMIN_AUDIT_LOG_QUERY_KEY = ['admin', 'audit-log'] as const;

export function useAdminAuditLogs(params?: AdminAuditLogParams) {
  return useQuery({
    queryKey: [...ADMIN_AUDIT_LOG_QUERY_KEY, params],
    queryFn: () => getAdminAuditLogs(params),
    staleTime: 10 * 1000,
  });
}
