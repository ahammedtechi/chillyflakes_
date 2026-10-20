import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { confirmPasswordReset } from '../../../api/vendorAuth';
import type {
  PasswordResetConfirmPayload,
  PasswordResetConfirmResponse,
  NormalizedApiError,
} from '../../../types/auth';

export function usePasswordResetConfirm(): UseMutationResult<
  PasswordResetConfirmResponse,
  NormalizedApiError,
  PasswordResetConfirmPayload
> {
  return useMutation<PasswordResetConfirmResponse, NormalizedApiError, PasswordResetConfirmPayload>({
    mutationFn: (payload: PasswordResetConfirmPayload) => confirmPasswordReset(payload),
  });
}
