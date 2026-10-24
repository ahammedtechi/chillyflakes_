import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminSellers,
  getAdminSellerDetail,
  verifySellerDocument,
  rejectSellerDocument,
  markSellerUnderReview,
  approveSellerMerchant,
  requestSellerResubmit,
  rejectSellerMerchant,
  suspendSellerMerchant,
  reactivateSellerMerchant,
  revealSellerSensitiveField,
  type AdminSellerFilterParams,
} from '../../../api/admin';

export const ADMIN_SELLERS_QUERY_KEY = ['admin', 'sellers'] as const;

export function useAdminSellers(params?: AdminSellerFilterParams) {
  return useQuery({
    queryKey: [...ADMIN_SELLERS_QUERY_KEY, params],
    queryFn: () => getAdminSellers(params),
    staleTime: 15 * 1000,
  });
}

export function useAdminSellerDetail(sellerId: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'sellers', sellerId],
    queryFn: () => getAdminSellerDetail(sellerId!),
    enabled: Boolean(sellerId),
    staleTime: 10 * 1000,
  });
}

export function useAdminSellerMutations() {
  const queryClient = useQueryClient();

  const invalidate = (sellerId?: string) => {
    queryClient.invalidateQueries({ queryKey: ADMIN_SELLERS_QUERY_KEY });
    if (sellerId) {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers', sellerId] });
    }
    queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'audit-log'] });
  };

  const verifyDocMutation = useMutation({
    mutationFn: ({ sellerId, docId }: { sellerId: string; docId: string }) =>
      verifySellerDocument(sellerId, docId),
    onSuccess: (_, vars) => invalidate(vars.sellerId),
  });

  const rejectDocMutation = useMutation({
    mutationFn: ({ sellerId, docId, reason }: { sellerId: string; docId: string; reason: string }) =>
      rejectSellerDocument(sellerId, docId, reason),
    onSuccess: (_, vars) => invalidate(vars.sellerId),
  });

  const underReviewMutation = useMutation({
    mutationFn: (sellerId: string) => markSellerUnderReview(sellerId),
    onSuccess: (_, sellerId) => invalidate(sellerId),
  });

  const approveMutation = useMutation({
    mutationFn: ({ sellerId, reason }: { sellerId: string; reason?: string }) =>
      approveSellerMerchant(sellerId, reason),
    onSuccess: (_, vars) => invalidate(vars.sellerId),
  });

  const requestResubmitMutation = useMutation({
    mutationFn: ({
      sellerId,
      reason,
      flagged_sections,
    }: {
      sellerId: string;
      reason: string;
      flagged_sections: string[];
    }) => requestSellerResubmit(sellerId, reason, flagged_sections),
    onSuccess: (_, vars) => invalidate(vars.sellerId),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ sellerId, reason }: { sellerId: string; reason: string }) =>
      rejectSellerMerchant(sellerId, reason),
    onSuccess: (_, vars) => invalidate(vars.sellerId),
  });

  const suspendMutation = useMutation({
    mutationFn: ({ sellerId, reason }: { sellerId: string; reason: string }) =>
      suspendSellerMerchant(sellerId, reason),
    onSuccess: (_, vars) => invalidate(vars.sellerId),
  });

  const reactivateMutation = useMutation({
    mutationFn: ({ sellerId, reason }: { sellerId: string; reason?: string }) =>
      reactivateSellerMerchant(sellerId, reason),
    onSuccess: (_, vars) => invalidate(vars.sellerId),
  });

  const revealMutation = useMutation({
    mutationFn: ({ sellerId, field }: { sellerId: string; field: 'tax_id' | 'pan' | 'bank_account' }) =>
      revealSellerSensitiveField(sellerId, field),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-log'] });
    },
  });

  return {
    verifyDocument: verifyDocMutation.mutateAsync,
    isVerifyingDoc: verifyDocMutation.isPending,
    rejectDocument: rejectDocMutation.mutateAsync,
    isRejectingDoc: rejectDocMutation.isPending,
    markUnderReview: underReviewMutation.mutateAsync,
    isMarkingUnderReview: underReviewMutation.isPending,
    approveSeller: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    requestResubmit: requestResubmitMutation.mutateAsync,
    isRequestingResubmit: requestResubmitMutation.isPending,
    rejectSeller: rejectMutation.mutateAsync,
    isRejecting: rejectMutation.isPending,
    suspendSeller: suspendMutation.mutateAsync,
    isSuspending: suspendMutation.isPending,
    reactivateSeller: reactivateMutation.mutateAsync,
    isReactivating: reactivateMutation.isPending,
    revealField: revealMutation.mutateAsync,
    isRevealing: revealMutation.isPending,
  };
}
