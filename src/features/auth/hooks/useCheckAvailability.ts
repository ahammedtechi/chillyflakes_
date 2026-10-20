import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { checkAvailability } from '../../../api/vendorAuth';
import type {
  CheckAvailabilityPayload,
  CheckAvailabilityResponse,
  NormalizedApiError,
} from '../../../types/auth';

export function useCheckAvailability(): UseMutationResult<
  CheckAvailabilityResponse,
  NormalizedApiError,
  CheckAvailabilityPayload
> {
  return useMutation<CheckAvailabilityResponse, NormalizedApiError, CheckAvailabilityPayload>({
    mutationFn: (payload: CheckAvailabilityPayload) => checkAvailability(payload),
  });
}
