import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const VendorPlaceholderPage: React.FC = () => {
  const location = useLocation();

  const getPageTitle = (path: string) => {
    if (path.includes('/products')) return 'Products Management';
    if (path.includes('/services')) return 'Services & Workshops';
    if (path.includes('/orders')) return 'Customer Orders';
    if (path.includes('/earnings')) return 'Earnings & Payouts';
    if (path.includes('/reviews')) return 'Customer Reviews';
    if (path.includes('/profile')) return 'Artisan Store Profile';
    if (path.includes('/settings')) return 'Portal Settings';
    if (path.includes('/support')) return 'Artisan Seller Support';
    return 'Artisan Workspace';
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-[#EAF1EA] border border-[#D1DDD0] text-[#2E4D34] flex items-center justify-center mb-5 shadow-xs">
        <Construction className="w-8 h-8" />
      </div>

      <span className="text-xs font-semibold text-[#8E9B90] uppercase tracking-wider mb-2">
        Feature In Progress
      </span>

      <h1 className="font-serif text-3xl font-bold text-[#223B28] mb-3">
        {title}
      </h1>

      <p className="text-xs sm:text-sm text-[#637365] leading-relaxed mb-6">
        This artisan management tool is currently being tailored for verified Indian creators and small-batch workshops. It will be available here soon.
      </p>

      <Link to="/vendor/dashboard">
        <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default VendorPlaceholderPage;
