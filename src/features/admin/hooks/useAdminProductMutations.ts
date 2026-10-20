import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveAdminProduct, rejectAdminProduct } from '../../../api/adminProducts';
import type { RejectReasonCode, AdminApprovePayload } from '../../../types/adminProduct';
import type { NormalizedApiError } from '../../../types/auth';

export function useAdminProductMutations() {
  const queryClient = useQueryClient();

  const invalidateAll = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    if (id) {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', id] });
    }
    // Also invalidate vendor cache to keep shared state synced
    queryClient.invalidateQueries({ queryKey: ['vendor', 'products'] });
    queryClient.invalidateQueries({ queryKey: ['vendor', 'dashboard'] });
  };

  const approveMutation = useMutation<
    unknown,
    NormalizedApiError,
    { id: string; payload?: AdminApprovePayload } | string
  >({
    mutationFn: (args) => {
      if (typeof args === 'string') {
        return approveAdminProduct(args);
      }
      return approveAdminProduct(args.id, args.payload);
    },
    onSuccess: (_, variables) => {
      const targetId = typeof variables === 'string' ? variables : variables.id;
      invalidateAll(targetId);
    },
  });

  const rejectMutation = useMutation<
    unknown,
    NormalizedApiError,
    { id: string; payload: { reason_code: RejectReasonCode; reason: string } }
  >({
    mutationFn: ({ id, payload }) => rejectAdminProduct(id, payload),
    onSuccess: (_, variables) => invalidateAll(variables.id),
  });

  return {
    approveMutation,
    rejectMutation,
  };
}
