import React from 'react';
import { UserCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/ui/Button';

export const VendorOnboardingPlaceholder: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="w-full flex items-center justify-center py-6">
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-[#EAE5DB] text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#ECDBC2]/50 text-[#5A4630] mx-auto flex items-center justify-center">
          <UserCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#223B28]">
            Vendor Onboarding
          </h1>
          <p className="text-sm text-[#637365]">
            Welcome, <span className="font-semibold text-[#2E4D34]">{user?.full_name || 'Seller'}</span>!
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE5DB] text-xs text-[#5F6D61] leading-relaxed">
          Your status is <strong className="text-[#5A4630]">Onboarding Incomplete</strong>. Complete your business KYC, bank payout details, and store banner here.
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            leftIcon={<LogOut className="w-4 h-4" />}
            className="mx-auto"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
export default VendorOnboardingPlaceholder;
