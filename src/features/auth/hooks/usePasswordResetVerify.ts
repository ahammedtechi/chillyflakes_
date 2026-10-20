import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { verifyPasswordResetOtp } from '../../../api/vendorAuth';
import type {
  PasswordResetVerifyPayload,
  PasswordResetVerifyResponse,
  NormalizedApiError,
} from '../../../types/auth';

export function usePasswordResetVerify(): UseMutationResult<
  PasswordResetVerifyResponse,
  NormalizedApiError,
  PasswordResetVerifyPayload
> {
  return useMutation<PasswordResetVerifyResponse, NormalizedApiError, PasswordResetVerifyPayload>({
    mutationFn: (payload: PasswordResetVerifyPayload) => verifyPasswordResetOtp(payload),
  });
}
