import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getLowStockItems } from '../../../api/vendorDashboard';
import type { DrfPaginatedResponse, LowStockItem } from '../../../types/dashboard';
import type { NormalizedApiError } from '../../../types/auth';

export const lowStockQueryKey = (page: number, pageSize: number) =>
  ['vendor', 'dashboard', 'low-stock', page, pageSize] as const;

export function useLowStock(
  page: number = 1,
  pageSize: number = 5
): UseQueryResult<DrfPaginatedResponse<LowStockItem>, NormalizedApiError> {
  return useQuery<DrfPaginatedResponse<LowStockItem>, NormalizedApiError>({
    queryKey: lowStockQueryKey(page, pageSize),
    queryFn: () => getLowStockItems(page, pageSize),
    staleTime: 60 * 1000,
    retry: 1,
  });
}
