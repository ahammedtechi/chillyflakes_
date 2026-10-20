import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckSquare, Users, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../../components/vendor/PageHeader';
import { useAdminProducts } from '../hooks/useAdminProducts';

export const AdminDashboardPage: React.FC = () => {
  const { data } = useAdminProducts({ page_size: 1 });
  const counts = data?.status_counts || { all: 0, pending_review: 0, approved: 0, rejected: 0 };

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Admin Overview"
        description="Monitor marketplace quality, seller submissions, and pending moderation queues."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Card */}
        <div className="bg-white rounded-2xl border border-[#F3E2B8] bg-gradient-to-br from-white to-[#FAF3E0]/30 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8A5A00]">Awaiting Review</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF3E0] text-[#8A5A00] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-[#223B28]">{counts.pending_review}</p>
            <p className="text-xs text-[#5F6D61] mt-1">Products waiting for decision</p>
          </div>
          <Link
            to="/admin/product-reviews?status=pending_review"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A5A00] hover:text-[#5B3C00] pt-1"
          >
            <span>Open Review Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Live Approved Card */}
        <div className="bg-white rounded-2xl border border-[#D1DDD0] bg-gradient-to-br from-white to-[#EAF1EA]/30 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#2E4D34]">Approved Products</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF1EA] text-[#2E4D34] flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-[#223B28]">{counts.approved}</p>
            <p className="text-xs text-[#5F6D61] mt-1">Currently live on store</p>
          </div>
          <Link
            to="/admin/product-reviews?status=approved"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E4D34] hover:underline pt-1"
          >
            <span>View Approved</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Seller Approvals Card */}
        <div className="bg-white rounded-2xl border border-[#EAE5DB] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5F6D61]">Seller Approvals</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#5F6D61] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-[#223B28]">0</p>
            <p className="text-xs text-[#5F6D61] mt-1">Vendor onboarding applications</p>
          </div>
          <span className="text-xs font-medium text-[#8E9B90] block pt-1">
            Module coming soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
