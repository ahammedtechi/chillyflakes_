import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Clock,
  AlertTriangle,
  ShieldX,
  CheckCircle2,
  LogOut,
  ArrowRight,
  HelpCircle,
  FileText,
  Mail,
  Store,
  MapPin,
  CreditCard,
  Building,
} from 'lucide-react';

import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/ui/Button';
import { useVendorStatus } from '../hooks/useVendorOnboarding';

export const VendorStatusPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const { data: statusData, isLoading: isStatusLoading } = useVendorStatus();

  const currentStatus = statusData?.status || user?.vendor_status || 'onboarding_incomplete';

  // Automatic status redirects
  useEffect(() => {
    if (currentStatus === 'approved') {
      navigate('/vendor/dashboard', { replace: true });
    } else if (currentStatus === 'onboarding_incomplete') {
      navigate('/vendor/onboarding', { replace: true });
    }
  }, [currentStatus, navigate]);

  if (isStatusLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#EAF1EA] border border-[#D1DDD0] flex items-center justify-center animate-spin">
          <div className="w-6 h-6 border-2 border-[#2E4D34] border-t-transparent rounded-full" />
        </div>
        <p className="text-xs font-semibold text-[#5F6D61] uppercase tracking-wider">
          {t('status.checking', { defaultValue: 'Checking seller status...' })}
        </p>
      </div>
    );
  }

  // Format submission date if present
  const formattedDate = statusData?.submitted_at
    ? new Date(statusData.submitted_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="w-full max-w-2xl mx-auto py-6 sm:py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-[#EAE5DB] text-center space-y-6">
        {/* ================================================================= */}
        {/* STATUS 1: UNDER REVIEW                                            */}
        {/* ================================================================= */}
        {currentStatus === 'under_review' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-[#EAF1EA] border border-[#D1DDD0] text-[#2E4D34] mx-auto flex items-center justify-center shadow-xs">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF1EA] text-[#2E4D34] text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('status.underReviewBadge', { defaultValue: 'Application Submitted' })}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#223B28]">
                {t('status.underReviewTitle', { defaultValue: 'Application Under Review' })}
              </h1>
              <p className="text-xs sm:text-sm text-[#637365] max-w-lg mx-auto leading-relaxed">
                {t('status.underReviewSubtitle', {
                  defaultValue:
                    'Our artisan curation team is verifying your KYC documents, bank credentials, and craft authenticity.',
                })}
              </p>
            </div>

            {/* Expected Turnaround Info Card */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE5DB] text-xs text-[#5F6D61] space-y-2 text-left">
              <div className="flex items-center justify-between border-b border-[#EAE5DB] pb-2 font-medium">
                <span>{t('status.submittedOn', { defaultValue: 'Submitted Date' })}:</span>
                <span className="font-semibold text-[#223B28]">{formattedDate || 'Recent'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#EAE5DB] pb-2 font-medium">
                <span>{t('status.expectedTimeLabel', { defaultValue: 'Expected Review Turnaround' })}:</span>
                <strong className="text-[#2E4D34]">
                  {t('status.expectedTurnaround', { defaultValue: '1-3 working days' })}
                </strong>
              </div>
              <div className="flex items-center justify-between pt-1 font-medium">
                <span>{t('status.notificationChannel', { defaultValue: 'Updates Delivered To' })}:</span>
                <span className="text-[#223B28]">{user?.email || 'Registered Email & Mobile'}</span>
              </div>
            </div>

            {/* Read-Only Summary Card (No Edits Allowed) */}
            {statusData?.summary && (
              <div className="p-5 rounded-2xl bg-white border border-[#D1DDD0] text-left space-y-3 shadow-2xs">
                <p className="text-xs font-bold text-[#2E4D34] uppercase tracking-wider">
                  {t('status.applicationSummary', { defaultValue: 'Submitted Store Summary' })}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#223B28]">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#7A8A7C]" />
                    <span>
                      <strong className="font-semibold">{statusData.summary.store_name || user?.store_name}</strong>
                    </span>
                  </div>
                  {statusData.summary.pickup_city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#7A8A7C]" />
                      <span>
                        {statusData.summary.pickup_city}, {statusData.summary.pickup_state}
                      </span>
                    </div>
                  )}
                  {statusData.summary.pan_masked && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#7A8A7C]" />
                      <span>PAN: <span className="font-mono">{statusData.summary.pan_masked}</span></span>
                    </div>
                  )}
                  {statusData.summary.bank_account_masked && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#7A8A7C]" />
                      <span>Payout: <span className="font-mono">{statusData.summary.bank_account_masked}</span></span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-xs text-[#7A8A7C] flex items-center justify-center gap-1.5 pt-2">
              <Clock className="w-3.5 h-3.5 text-[#2E4D34]" />
              <span>{t('status.noEditsNotice', { defaultValue: 'Your application is locked while our reviewers complete verification.' })}</span>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STATUS 2: RESUBMISSION REQUESTED & REJECTED                       */}
        {/* ================================================================= */}
        {(currentStatus === 'resubmission_requested' || currentStatus === 'rejected') && (
          <div className="space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-[#FFF0F0] border border-[#FCA5A5] text-[#DC2626] mx-auto flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F0] text-[#DC2626] text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>
                  {currentStatus === 'resubmission_requested'
                    ? t('status.resubmitBadge', { defaultValue: 'Action Required' })
                    : t('status.rejectedBadge', { defaultValue: 'Application Flagged' })}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#223B28]">
                {currentStatus === 'resubmission_requested'
                  ? t('status.resubmitTitle', { defaultValue: 'Re-verification Requested' })
                  : t('status.rejectedTitle', { defaultValue: 'Application Not Approved' })}
              </h1>
              <p className="text-xs sm:text-sm text-[#637365] max-w-lg mx-auto leading-relaxed">
                {t('status.resubmitSubtitle', {
                  defaultValue: 'The verification team reviewed your submission and requested the following corrections:',
                })}
              </p>
            </div>

            {/* Admin Rejection Reason Box */}
            <div className="p-5 rounded-2xl bg-[#FFF8F7] border border-[#FCA5A5] text-left space-y-2 text-xs">
              <p className="font-bold text-[#991B1B] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>{t('status.feedbackTitle', { defaultValue: 'Reviewer Feedback & Notes' })}</span>
              </p>
              <p className="text-[#7F1D1D] leading-relaxed text-sm bg-white/70 p-3 rounded-xl border border-[#FCA5A5]/40 font-serif">
                "{statusData?.rejection_reason || 'Please correct the flagged documents and provide clear details regarding your craft production.'}"
              </p>

              {statusData?.flagged_sections && statusData.flagged_sections.length > 0 && (
                <div className="pt-2 text-xs text-[#7F1D1D]">
                  <span className="font-semibold">{t('status.flaggedSections', { defaultValue: 'Flagged Sections' })}: </span>
                  {statusData.flagged_sections
                    .map((s: number) => (s === 1 ? 'Step 1: Store Details' : s === 3 ? 'Step 3: Verification (KYC)' : `Step ${s}`))
                    .join(', ')}
                </div>
              )}
            </div>

            {/* Primary Action Button: Fix & Resubmit */}
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  const targetStep =
                    statusData?.flagged_sections && statusData.flagged_sections.length > 0
                      ? statusData.flagged_sections[0]
                      : 1;
                  navigate(`/vendor/onboarding?step=${targetStep}`);
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto px-8 mx-auto"
              >
                {t('status.fixAndResubmit', { defaultValue: 'Fix and Resubmit Application' })}
              </Button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STATUS 3: SUSPENDED                                               */}
        {/* ================================================================= */}
        {currentStatus === 'suspended' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-[#FFF0F0] border border-[#FCA5A5] text-[#DC2626] mx-auto flex items-center justify-center shadow-xs">
              <ShieldX className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F0] text-[#DC2626] text-xs font-bold">
                <ShieldX className="w-3.5 h-3.5" />
                <span>{t('status.suspendedBadge', { defaultValue: 'Store Suspended' })}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#223B28]">
                {t('status.suspendedTitle', { defaultValue: 'Seller Account Suspended' })}
              </h1>
              <p className="text-xs sm:text-sm text-[#637365] max-w-lg mx-auto leading-relaxed">
                {t('status.suspendedSubtitle', {
                  defaultValue: 'Your artisan store is temporarily inactive following a marketplace compliance review.',
                })}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF8F7] border border-[#FCA5A5] text-left space-y-2 text-xs">
              <p className="font-bold text-[#991B1B] uppercase tracking-wider">
                {t('status.reasonLabel', { defaultValue: 'Suspension Reason' })}
              </p>
              <p className="text-[#7F1D1D] leading-relaxed text-sm bg-white/70 p-3 rounded-xl border border-[#FCA5A5]/40 font-serif">
                "{statusData?.rejection_reason || 'Compliance flag triggered on seller payout bank account details.'}"
              </p>
            </div>

            <div className="pt-2">
              <a
                href="mailto:support@chillyflakes.in?subject=Suspended%20Seller%20Account%20Assistance"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2E4D34] text-white text-xs font-bold hover:bg-[#1D3222] transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4" />
                <span>{t('status.contactSupport', { defaultValue: 'Contact Seller Support' })}</span>
              </a>
            </div>
          </div>
        )}

        {/* Global Footer Actions: Help & Logout */}
        <div className="pt-6 border-t border-[#EAE5DB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#637365]">
          <a
            href="mailto:sellers@chillyflakes.in"
            className="inline-flex items-center gap-1.5 hover:text-[#2E4D34] transition-colors font-medium"
          >
            <HelpCircle className="w-4 h-4 text-[#7A8A7C]" />
            <span>{t('status.needHelp', { defaultValue: 'Need assistance? Email sellers@chillyflakes.in' })}</span>
          </a>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void handleLogout()}
            isLoading={isLoggingOut}
            disabled={isLoggingOut}
            leftIcon={<LogOut className="w-4 h-4 text-[#8E9B90]" />}
            className="text-xs text-[#637365]"
          >
            {t('common.logout', { defaultValue: 'Logout' })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorStatusPage;
