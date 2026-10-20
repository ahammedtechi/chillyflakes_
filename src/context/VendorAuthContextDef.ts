import { createContext } from 'react';
import type { VendorUser } from '../types/auth';

export interface VendorAuthContextType {
  user: VendorUser | null;
  isLoading: boolean;
  setUser: (user: VendorUser | null) => void;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

export const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined);
