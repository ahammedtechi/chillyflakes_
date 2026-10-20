import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { useAdminAuth } from '../context/AdminAuthContext';

export interface AdminNoAccessPageProps {
  role?: 'vendor' | 'admin' | 'unknown';
}

export const AdminNoAccessPage: React.FC<AdminNoAccessPageProps> = ({ role = 'vendor' }) => {
  const { logout: vendorLogout } = useAuth();
  const { logout: adminLogout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#223B28] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="mb-6">
        <Logo variant="dark" size="md" />
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAE5DB] p-6 sm:p-8 shadow-sm text-center space-y-5 animate-scaleUp">
        <div className="w-14 h-14 rounded-2xl bg-[#FFF0F0] border border-[#FED7D7] text-[#C53030] flex items-center justify-center mx-auto shadow-2xs">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#223B28]">
            Access Restricted
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#637365] leading-relaxed">
            {role === 'vendor'
              ? 'This administration console is restricted exclusively to ChillyFlakes Platform Administrators. Your current session is signed in as an Artisan Seller.'
              : role === 'admin'
              ? 'The Vendor Portal is reserved for registered artisan merchants. Your current session is signed in as a Platform Super Administrator.'
              : 'You do not have permission to view this section of the marketplace.'}
          </p>
        </div>

        <div className="pt-2 space-y-2.5">
          {role === 'vendor' ? (
            <>
              <Link
                to="/vendor/dashboard"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2E4D34] hover:bg-[#233B28] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Seller Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={() => vendorLogout()}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#EAE5DB] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#DC2626] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout from Seller Account</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/admin/product-reviews"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2E4D34] hover:bg-[#233B28] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Admin Console</span>
              </Link>
              <button
                type="button"
                onClick={() => adminLogout()}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#EAE5DB] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#DC2626] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout from Admin Account</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNoAccessPage;
