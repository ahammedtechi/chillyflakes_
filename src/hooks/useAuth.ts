import { useContext } from 'react';
import { VendorAuthContext, type VendorAuthContextType } from '../context/VendorAuthContextDef';

export const useAuth = (): VendorAuthContextType => {
  const context = useContext(VendorAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a VendorAuthProvider');
  }
  return context;
};

export default useAuth;
