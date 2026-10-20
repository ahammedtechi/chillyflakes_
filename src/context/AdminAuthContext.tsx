import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminLogin as apiAdminLogin, adminLogout as apiAdminLogout, getAdminMe } from '../api/adminProducts';
import type { AdminUser } from '../types/adminProduct';

export interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AdminUser>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAdmin = useCallback(async () => {
    try {
      const data = await getAdminMe();
      if (data && data.role === 'admin') {
        setAdmin(data);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAdmin();
  }, [fetchAdmin]);

  const login = async (email: string, password: string): Promise<AdminUser> => {
    setIsLoading(true);
    try {
      const res = await apiAdminLogin({ email, password });
      setAdmin(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await apiAdminLogout();
    } finally {
      setAdmin(null);
      setIsLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: Boolean(admin && admin.role === 'admin'),
        login,
        logout,
        refreshAdmin: fetchAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
