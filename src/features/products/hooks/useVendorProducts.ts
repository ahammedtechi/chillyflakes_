import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getVendorProducts } from '../../../api/vendorProducts';
import type {
  VendorProductListResponse,
  VendorProductFilterParams,
} from '../../../types/product';
import type { NormalizedApiError } from '../../../types/auth';

export const vendorProductsQueryKey = (params?: VendorProductFilterParams) =>
  ['vendor', 'products', params] as const;

export function useVendorProducts(
  params?: VendorProductFilterParams
): UseQueryResult<VendorProductListResponse, NormalizedApiError> {
  return useQuery<VendorProductListResponse, NormalizedApiError>({
    queryKey: vendorProductsQueryKey(params),
    queryFn: () => getVendorProducts(params),
    staleTime: 30 * 1000,
    retry: 1,
  });
}
