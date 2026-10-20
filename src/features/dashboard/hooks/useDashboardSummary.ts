import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getDashboardSummary } from '../../../api/vendorDashboard';
import type { DashboardSummary } from '../../../types/dashboard';
import type { NormalizedApiError } from '../../../types/auth';

export const DASHBOARD_SUMMARY_QUERY_KEY = ['vendor', 'dashboard', 'summary'] as const;

export function useDashboardSummary(): UseQueryResult<DashboardSummary, NormalizedApiError> {
  return useQuery<DashboardSummary, NormalizedApiError>({
    queryKey: DASHBOARD_SUMMARY_QUERY_KEY,
    queryFn: () => getDashboardSummary(),
    staleTime: 60 * 1000,
    retry: 1,
  });
}
