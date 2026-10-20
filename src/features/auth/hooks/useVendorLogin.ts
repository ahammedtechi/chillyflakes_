import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { loginVendor } from '../../../api/vendorAuth';
import type {
  VendorLoginPayload,
  VendorLoginResponse,
  NormalizedApiError,
} from '../../../types/auth';

export function useVendorLogin(): UseMutationResult<
  VendorLoginResponse,
  NormalizedApiError,
  VendorLoginPayload
> {
  return useMutation<VendorLoginResponse, NormalizedApiError, VendorLoginPayload>({
    mutationFn: (payload: VendorLoginPayload) => loginVendor(payload),
  });
}
