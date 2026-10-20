import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getPasswordResetStatus } from '../../../api/vendorAuth';
import type { PasswordResetStatusResponse, NormalizedApiError } from '../../../types/auth';

export const PASSWORD_RESET_STATUS_QUERY_KEY = ['vendor', 'password-reset-status'] as const;

export function usePasswordResetStatus(enabled = true): UseQueryResult<
  PasswordResetStatusResponse,
  NormalizedApiError
> {
  return useQuery<PasswordResetStatusResponse, NormalizedApiError>({
    queryKey: PASSWORD_RESET_STATUS_QUERY_KEY,
    queryFn: () => getPasswordResetStatus(),
    enabled,
    retry: false,
    staleTime: 0,
  });
}
