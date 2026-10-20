import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getDashboardAlerts } from '../../../api/vendorDashboard';
import type { VendorAlert } from '../../../types/dashboard';
import type { NormalizedApiError } from '../../../types/auth';

export const DASHBOARD_ALERTS_QUERY_KEY = ['vendor', 'dashboard', 'alerts'] as const;

export function useDashboardAlerts(): UseQueryResult<VendorAlert[], NormalizedApiError> {
  return useQuery<VendorAlert[], NormalizedApiError>({
    queryKey: DASHBOARD_ALERTS_QUERY_KEY,
    queryFn: () => getDashboardAlerts(),
    staleTime: 60 * 1000,
    retry: 1,
  });
}
