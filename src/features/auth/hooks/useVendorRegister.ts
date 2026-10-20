import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { registerVendor } from '../../../api/vendorAuth';
import type {
  VendorRegisterPayload,
  VendorRegisterResponse,
  NormalizedApiError,
} from '../../../types/auth';

export function useVendorRegister(): UseMutationResult<
  VendorRegisterResponse,
  NormalizedApiError,
  VendorRegisterPayload
> {
  return useMutation<VendorRegisterResponse, NormalizedApiError, VendorRegisterPayload>({
    mutationFn: (payload: VendorRegisterPayload) => registerVendor(payload),
  });
}
