import React from 'react';
import { Clock, AlertTriangle, ShieldX, LogOut } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/ui/Button';

export const VendorStatusPlaceholder: React.FC = () => {
  const { user, logout } = useAuth();

  const getStatusContent = () => {
    switch (user?.vendor_status) {
      case 'under_review':
        return {
          icon: <Clock className="w-8 h-8 text-[#E29D38]" />,
          bgColor: 'bg-[#FAF3E0]',
          title: 'Account Under Review',
          message: 'Our artisan curation team is currently reviewing your store application. We will notify you via SMS within 24-48 business hours.',
        };
      case 'rejected':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-[#DC2626]" />,
          bgColor: 'bg-[#FFF8F7]',
          title: 'Application Not Approved',
          message: 'Thank you for your interest in ChillyFlakes. Unfortunately, your seller application does not meet our artisan authenticity criteria at this time.',
        };
      case 'suspended':
        return {
          icon: <ShieldX className="w-8 h-8 text-[#DC2626]" />,
          bgColor: 'bg-[#FFF8F7]',
          title: 'Account Suspended',
          message: 'Your seller account has been temporarily suspended due to a policy compliance check. Please reach out to seller support.',
        };
      default:
        return {
          icon: <Clock className="w-8 h-8 text-[#2E4D34]" />,
          bgColor: 'bg-[#EAF1EA]',
          title: 'Seller Account Status',
          message: `Current status: ${user?.vendor_status || 'Checking status...'}`,
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className="w-full flex items-center justify-center py-6">
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-[#EAE5DB] text-center space-y-6">
        <div className={`w-16 h-16 rounded-2xl ${content.bgColor} mx-auto flex items-center justify-center`}>
          {content.icon}
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#223B28]">
            {content.title}
          </h1>
          <p className="text-sm text-[#637365]">
            Seller: <span className="font-semibold text-[#2E4D34]">{user?.full_name || 'Vendor'}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE5DB] text-xs text-[#5F6D61] leading-relaxed">
          {content.message}
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
export default VendorStatusPlaceholder;
