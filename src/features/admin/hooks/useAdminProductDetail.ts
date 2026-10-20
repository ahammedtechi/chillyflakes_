import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getAdminProductDetail } from '../../../api/adminProducts';
import type { AdminProductDetail } from '../../../types/adminProduct';
import type { NormalizedApiError } from '../../../types/auth';

export const adminProductDetailQueryKey = (id: string) =>
  ['admin', 'product', id] as const;

export function useAdminProductDetail(
  id: string
): UseQueryResult<AdminProductDetail, NormalizedApiError> {
  return useQuery<AdminProductDetail, NormalizedApiError>({
    queryKey: adminProductDetailQueryKey(id),
    queryFn: () => getAdminProductDetail(id),
    staleTime: 15 * 1000,
    retry: 1,
    enabled: Boolean(id),
  });
}
