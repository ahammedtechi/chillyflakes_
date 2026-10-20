import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/Logo';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#223B28] flex flex-col font-sans">
      <header className="border-b border-[#EAE5DB] bg-white py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Logo variant="dark" size="sm" showTagline={false} />
          </Link>
          <Link
            to="/vendor/register"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E4D34] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Registration</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-grow">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#EAE5DB] space-y-6">
          <div className="flex items-center gap-3 text-[#2E4D34]">
            <FileText className="w-6 h-6" />
            <h1 className="font-serif text-3xl font-bold">Seller Terms & Conditions</h1>
          </div>
          <p className="text-xs text-[#637365]">Last updated: October 2026</p>

          <div className="prose text-xs text-[#3A463B] leading-relaxed space-y-4">
            <h2 className="text-sm font-bold text-[#223B28]">1. Seller Eligibility & Authenticity</h2>
            <p>
              ChillyFlakes is a dedicated marketplace for authentic, natural, handmade, and curated goods.
              By registering as a seller, you verify that your products comply with Indian standard consumer
              protection guidelines and that all handcrafted or natural claims are genuine.
            </p>

            <h2 className="text-sm font-bold text-[#223B28]">2. Pricing, Commission & Payouts</h2>
            <p>
              Sellers maintain full autonomy over their product pricing. ChillyFlakes charges a standard
              platform commission on completed sales, with automatic weekly payouts directly to your registered
              bank account.
            </p>

            <h2 className="text-sm font-bold text-[#223B28]">3. Order Fulfillment & Standards</h2>
            <p>
              Sellers agree to package goods mindfully using eco-friendly materials whenever possible, and dispatch
              orders within the agreed timeframe stated in their store dashboard.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
export default TermsPage;
