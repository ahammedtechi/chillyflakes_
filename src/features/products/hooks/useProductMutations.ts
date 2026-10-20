import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  duplicateProduct,
  withdrawProduct,
  unpublishProduct,
  republishProduct,
  archiveProduct,
  deleteProduct,
} from '../../../api/vendorProducts';
import type { NormalizedApiError } from '../../../types/auth';

export function useProductMutations() {
  const queryClient = useQueryClient();

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ['vendor', 'products'] });
    queryClient.invalidateQueries({ queryKey: ['vendor', 'dashboard'] });
  };

  const duplicateMutation = useMutation<unknown, NormalizedApiError, string>({
    mutationFn: (id: string) => duplicateProduct(id),
    onSuccess: invalidateProducts,
  });

  const withdrawMutation = useMutation<unknown, NormalizedApiError, string>({
    mutationFn: (id: string) => withdrawProduct(id),
    onSuccess: invalidateProducts,
  });

  const unpublishMutation = useMutation<unknown, NormalizedApiError, string>({
    mutationFn: (id: string) => unpublishProduct(id),
    onSuccess: invalidateProducts,
  });

  const republishMutation = useMutation<unknown, NormalizedApiError, string>({
    mutationFn: (id: string) => republishProduct(id),
    onSuccess: invalidateProducts,
  });

  const archiveMutation = useMutation<unknown, NormalizedApiError, string>({
    mutationFn: (id: string) => archiveProduct(id),
    onSuccess: invalidateProducts,
  });

  const deleteMutation = useMutation<unknown, NormalizedApiError, string>({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: invalidateProducts,
  });

  return {
    duplicateMutation,
    withdrawMutation,
    unpublishMutation,
    republishMutation,
    archiveMutation,
    deleteMutation,
  };
}

