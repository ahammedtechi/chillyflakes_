import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVendorCategories,
  getVendorProductDetail,
  createProductDraft,
  updateProduct,
  submitProductForReview,
} from '../../../api/vendorProducts';
import type {
  VendorCategoryWithAttributes,
} from '../../../types/categoryAttributes';
import type {
  VendorProductPayload,
  VendorProductDetailResponse,
} from '../../../types/product';
import type { NormalizedApiError } from '../../../types/auth';

export function useVendorCategories() {
  return useQuery<VendorCategoryWithAttributes[], NormalizedApiError>({
    queryKey: ['vendor', 'categories'],
    queryFn: getVendorCategories,
    staleTime: 60 * 1000,
  });
}

export function useVendorProductDetail(id?: string) {
  return useQuery<VendorProductDetailResponse, NormalizedApiError>({
    queryKey: ['vendor', 'product', id],
    queryFn: () => {
      if (!id) throw new Error('Product ID required');
      return getVendorProductDetail(id);
    },
    enabled: Boolean(id && id !== 'new'),
    staleTime: 10 * 1000,
  });
}

export function useProductFormMutations() {
  const queryClient = useQueryClient();

  const invalidateProductQueries = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ['vendor', 'products'] });
    queryClient.invalidateQueries({ queryKey: ['vendor', 'dashboard'] });
    if (id) {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'product', id] });
    }
    // Also invalidate admin review cache so changes sync mutually
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
  };

  const createDraftMutation = useMutation<
    VendorProductDetailResponse,
    NormalizedApiError,
    Partial<VendorProductPayload>
  >({
    mutationFn: (payload) => createProductDraft(payload),
    onSuccess: (data) => invalidateProductQueries(data.id),
  });

  const updateDraftMutation = useMutation<
    VendorProductDetailResponse,
    NormalizedApiError,
    { id: string; payload: Partial<VendorProductPayload> }
  >({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onSuccess: (data) => invalidateProductQueries(data.id),
  });

  const submitForReviewMutation = useMutation<
    VendorProductDetailResponse,
    NormalizedApiError,
    string
  >({
    mutationFn: (id) => submitProductForReview(id),
    onSuccess: (data) => invalidateProductQueries(data.id),
  });

  return {
    createDraftMutation,
    updateDraftMutation,
    submitForReviewMutation,
  };
}
