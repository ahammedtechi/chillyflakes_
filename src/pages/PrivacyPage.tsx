import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/Logo';

export const PrivacyPage: React.FC = () => {
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
            <Shield className="w-6 h-6" />
            <h1 className="font-serif text-3xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xs text-[#637365]">Last updated: October 2026</p>

          <div className="prose text-xs text-[#3A463B] leading-relaxed space-y-4">
            <h2 className="text-sm font-bold text-[#223B28]">1. Information We Collect</h2>
            <p>
              We collect your name, business name, phone number, email address, and location details
              solely to operate your seller account, verify your business, and process orders.
            </p>

            <h2 className="text-sm font-bold text-[#223B28]">2. Security of Your Data</h2>
            <p>
              Your personal information and credentials are encrypted using industry-standard protocols.
              We never sell your contact details or business secrets to third parties.
            </p>

            <h2 className="text-sm font-bold text-[#223B28]">3. Communications & OTPs</h2>
            <p>
              Your mobile number is used strictly for transactional notifications, account security verifications
              via SMS OTP, and critical platform updates.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
export default PrivacyPage;
