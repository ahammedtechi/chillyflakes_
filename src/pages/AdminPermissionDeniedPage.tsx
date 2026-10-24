import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AdminPermissionDeniedPageProps {
  moduleName?: string;
  actionName?: string;
}

export const AdminPermissionDeniedPage: React.FC<AdminPermissionDeniedPageProps> = ({
  moduleName = 'this section',
  actionName = 'view',
}) => {
  const navigate = useNavigate();
  const { admin } = useAdminAuth();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-[#FFF8E6] border border-[#F3E2B8] flex items-center justify-center text-[#8A5A00] mb-4 shadow-xs">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A5A00] bg-[#FAF3E0] px-3 py-1 rounded-full mb-3 border border-[#F3E2B8]">
        Access Restricted
      </span>

      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#223B28] mb-2">
        Permission Denied
      </h1>

      <p className="max-w-md text-sm text-[#5F6D61] mb-6 leading-relaxed">
        Your current staff role{' '}
        <strong className="text-[#223B28]">({admin?.role_name || admin?.role || 'Staff'})</strong> does not have
        permission to {actionName} {moduleName}. Contact your platform Super Admin if you believe this is an error.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D1DDD0] bg-white text-xs font-semibold text-[#223B28] hover:bg-[#FAF7F2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <Link
          to="/admin"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E4D34] text-white text-xs font-semibold hover:bg-[#233B28] transition-colors shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>Console Home</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminPermissionDeniedPage;
