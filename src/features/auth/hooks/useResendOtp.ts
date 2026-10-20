import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { resendOtp } from '../../../api/vendorAuth';
import { VERIFICATION_STATUS_QUERY_KEY } from './useVerificationStatus';
import type {
  ResendOtpPayload,
  ResendOtpResponse,
  NormalizedApiError,
} from '../../../types/auth';

export function useResendOtp(): UseMutationResult<
  ResendOtpResponse,
  NormalizedApiError,
  ResendOtpPayload
> {
  const queryClient = useQueryClient();

  return useMutation<ResendOtpResponse, NormalizedApiError, ResendOtpPayload>({
    mutationFn: (payload: ResendOtpPayload) => resendOtp(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: VERIFICATION_STATUS_QUERY_KEY });
    },
  });
}
