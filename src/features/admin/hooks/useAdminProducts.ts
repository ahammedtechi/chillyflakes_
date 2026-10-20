import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getAdminProducts } from '../../../api/adminProducts';
import type {
  AdminProductListResponse,
  AdminProductFilterParams,
} from '../../../types/adminProduct';
import type { NormalizedApiError } from '../../../types/auth';

export const adminProductsQueryKey = (params?: AdminProductFilterParams) =>
  ['admin', 'products', params] as const;

export function useAdminProducts(
  params?: AdminProductFilterParams
): UseQueryResult<AdminProductListResponse, NormalizedApiError> {
  return useQuery<AdminProductListResponse, NormalizedApiError>({
    queryKey: adminProductsQueryKey(params),
    queryFn: () => getAdminProducts(params),
    staleTime: 15 * 1000,
    retry: 1,
  });
}
