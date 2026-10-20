import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getVerificationStatus } from '../../../api/vendorAuth';
import type { VerificationStatusResponse, NormalizedApiError } from '../../../types/auth';

export const VERIFICATION_STATUS_QUERY_KEY = ['vendor', 'verification-status'] as const;

export function useVerificationStatus(enabled = true): UseQueryResult<
  VerificationStatusResponse,
  NormalizedApiError
> {
  return useQuery<VerificationStatusResponse, NormalizedApiError>({
    queryKey: VERIFICATION_STATUS_QUERY_KEY,
    queryFn: () => getVerificationStatus(),
    enabled,
    retry: false,
    staleTime: 5000,
  });
}
