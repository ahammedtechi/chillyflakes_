import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { loginVendor, getVendorMe } from '../../../api/vendorAuth';
import { fetchCsrfToken } from '../../../api/client';
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
    mutationFn: async (payload: VendorLoginPayload) => {
      // Requirement 2: The login mutation must ALWAYS obtain a fresh token first
      await fetchCsrfToken('before login');

      try {
        const res = await loginVendor(payload);
        // Requirement 3: After a successful login, immediately fetch a fresh token again (login rotates it)
        await fetchCsrfToken('after login');
        return res;
      } catch (err: unknown) {
        // Requirement 4: For login specifically, before showing error, check if session was established
        try {
          const me = await getVendorMe();
          if (me && me.id) {
            await fetchCsrfToken('after login');
            return {
              user: me,
              vendor_status: me.vendor_status,
              message: 'Login successful.',
              requires_verification: false,
            } as VendorLoginResponse;
          }
        } catch {
          // me failed as well; genuine login failure
        }

        throw err as NormalizedApiError;
      }
    },
  });
}
