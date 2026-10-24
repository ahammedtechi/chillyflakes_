import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAuth } from '../hooks/useAuth';
import { AdminNoAccessPage } from '../pages/AdminNoAccessPage';

export interface RequireAdminProps {
  children?: React.ReactNode;
}

export const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { admin, isLoading: adminLoading } = useAdminAuth();
  const { user, isLoading: vendorLoading } = useAuth();
  const location = useLocation();

  if (adminLoading || vendorLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-[#EAF1EA] border border-[#D1DDD0] flex items-center justify-center animate-spin">
          <div className="w-6 h-6 border-2 border-[#2E4D34] border-t-transparent rounded-full" />
        </div>
        <p className="mt-4 text-xs font-semibold text-[#5F6D61] tracking-wide uppercase">
          Verifying Administrator Privileges...
        </p>
      </div>
    );
  }

  // If vendor is signed in, forbid access to /admin
  if (user) {
    return <AdminNoAccessPage role="vendor" />;
  }

  // If not signed in as admin or staff, redirect to admin login
  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RequireAdmin;
