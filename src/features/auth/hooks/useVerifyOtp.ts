import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { verifyOtp } from '../../../api/vendorAuth';
import { VERIFICATION_STATUS_QUERY_KEY } from './useVerificationStatus';
import type {
  VerifyOtpPayload,
  VerifyOtpResponse,
  NormalizedApiError,
} from '../../../types/auth';

export function useVerifyOtp(): UseMutationResult<
  VerifyOtpResponse,
  NormalizedApiError,
  VerifyOtpPayload
> {
  const queryClient = useQueryClient();

  return useMutation<VerifyOtpResponse, NormalizedApiError, VerifyOtpPayload>({
    mutationFn: (payload: VerifyOtpPayload) => verifyOtp(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: VERIFICATION_STATUS_QUERY_KEY });
    },
  });
}
