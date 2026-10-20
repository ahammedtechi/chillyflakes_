import React, { useState, useEffect, useCallback } from 'react';
import type { VendorUser } from '../types/auth';
import { getVendorMe, logoutVendor } from '../api/vendorAuth';
import { setOnUnauthorizedCallback } from '../api/client';
import { VendorAuthContext } from './VendorAuthContextDef';

export const VendorAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In-memory user state ONLY - no localStorage or sessionStorage
  const [user, setUser] = useState<VendorUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await getVendorMe();
      setUser(userData);
    } catch {
      // Not logged in or session expired
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUser();

    // Register 401 callback to clear memory user state
    setOnUnauthorizedCallback(() => {
      setUser(null);
    });

    return () => {
      setOnUnauthorizedCallback(null);
    };
  }, [fetchUser]);

  const logout = async () => {
    try {
      await logoutVendor();
    } catch {
      // Proceed even if network fails
    } finally {
      setUser(null);
      if (typeof window !== 'undefined' && window.location.pathname !== '/vendor/login') {
        window.location.assign('/vendor/login');
      }
    }
  };

  return (
    <VendorAuthContext.Provider
      value={{
        user,
        isLoading,
        setUser,
        logout,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </VendorAuthContext.Provider>
  );
};

export default VendorAuthProvider;
