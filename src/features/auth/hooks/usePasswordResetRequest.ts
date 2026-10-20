import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { requestPasswordReset } from '../../../api/vendorAuth';
import type {
  PasswordResetRequestPayload,
  PasswordResetRequestResponse,
  NormalizedApiError,
} from '../../../types/auth';

export function usePasswordResetRequest(): UseMutationResult<
  PasswordResetRequestResponse,
  NormalizedApiError,
  PasswordResetRequestPayload
> {
  return useMutation<PasswordResetRequestResponse, NormalizedApiError, PasswordResetRequestPayload>({
    mutationFn: (payload: PasswordResetRequestPayload) => requestPasswordReset(payload),
  });
}
