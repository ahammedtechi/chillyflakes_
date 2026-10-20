import React from 'react';
import { Users } from 'lucide-react';
import { EmptyState } from '../../../components/vendor/EmptyState';
import { PageHeader } from '../../../components/vendor/PageHeader';

export const AdminPlaceholderPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Seller Approvals"
        description="Verify and onboard new artisan seller registrations."
      />

      <div className="bg-white rounded-3xl border border-[#EAE5DB] p-8 sm:p-12 shadow-xs">
        <EmptyState
          icon={<Users className="w-8 h-8 text-[#8E9B90]" />}
          title="Seller Approvals Coming Soon"
          description="The seller document verification, GST verification, and onboarding approval workflow will be released in the next update."
        />
      </div>
    </div>
  );
};

export default AdminPlaceholderPage;
