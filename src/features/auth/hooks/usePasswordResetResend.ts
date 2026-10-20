import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { resendPasswordResetOtp } from '../../../api/vendorAuth';
import type { PasswordResetResendResponse, NormalizedApiError } from '../../../types/auth';

export function usePasswordResetResend(): UseMutationResult<
  PasswordResetResendResponse,
  NormalizedApiError,
  void
> {
  return useMutation<PasswordResetResendResponse, NormalizedApiError, void>({
    mutationFn: () => resendPasswordResetOtp(),
  });
}
