import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getSalesChart } from '../../../api/vendorDashboard';
import type { SalesChartResponse, SalesChartRange } from '../../../types/dashboard';
import type { NormalizedApiError } from '../../../types/auth';

export const salesChartQueryKey = (range: SalesChartRange) => ['vendor', 'dashboard', 'sales-chart', range] as const;

export function useSalesChart(range: SalesChartRange = '30'): UseQueryResult<SalesChartResponse, NormalizedApiError> {
  return useQuery<SalesChartResponse, NormalizedApiError>({
    queryKey: salesChartQueryKey(range),
    queryFn: () => getSalesChart(range),
    staleTime: 60 * 1000,
    retry: 1,
  });
}
