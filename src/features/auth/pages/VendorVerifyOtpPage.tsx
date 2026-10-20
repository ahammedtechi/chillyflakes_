import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Smartphone,
  Mail,
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

import { OtpInput } from '../../../components/ui/OtpInput';
import { Button } from '../../../components/ui/Button';
import { useVerificationStatus } from '../hooks/useVerificationStatus';
import { useVerifyOtp } from '../hooks/useVerifyOtp';
import { useResendOtp } from '../hooks/useResendOtp';
import type { NormalizedApiError } from '../../../types/auth';

export const VendorVerifyOtpPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Load verification status from backend / MSW
  const {
    data: statusData,
    isLoading: isStatusLoading,
    isError: isStatusError,
  } = useVerificationStatus();

  // Redirect to register if there is no pending registration
  useEffect(() => {
    if (isStatusError) {
      navigate('/vendor/register', { replace: true });
    }
  }, [isStatusError, navigate]);

  // Mutations
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  // Mobile channel state
  const [mobileOtp, setMobileOtp] = useState('');
  const [mobileHasError, setMobileHasError] = useState(false);
  const [mobileErrorMessage, setMobileErrorMessage] = useState<string | null>(null);
  const [mobileCountdown, setMobileCountdown] = useState<number | null>(null);
  const [mobileLockSeconds, setMobileLockSeconds] = useState(0);
  const [mobileVerifiedLocally, setMobileVerifiedLocally] = useState(false);

  // Email channel state
  const [emailOtp, setEmailOtp] = useState('');
  const [emailHasError, setEmailHasError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null);
  const [emailCountdown, setEmailCountdown] = useState<number | null>(null);
  const [emailLockSeconds, setEmailLockSeconds] = useState(0);
  const [emailVerifiedLocally, setEmailVerifiedLocally] = useState(false);

  const mobileResendSeconds = mobileCountdown !== null
    ? mobileCountdown
    : (statusData?.mobile?.resend_available_in ?? 30);

  const emailResendSeconds = emailCountdown !== null
    ? emailCountdown
    : (statusData?.email?.resend_available_in ?? 30);

  // Active 1-second countdown clock for resends and lockout timers
  useEffect(() => {
    const timer = setInterval(() => {
      setMobileCountdown((prev) => {
        const current = prev !== null ? prev : (statusData?.mobile?.resend_available_in ?? 30);
        return current > 0 ? current - 1 : 0;
      });
      setEmailCountdown((prev) => {
        const current = prev !== null ? prev : (statusData?.email?.resend_available_in ?? 30);
        return current > 0 ? current - 1 : 0;
      });
      setMobileLockSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setEmailLockSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [statusData?.mobile?.resend_available_in, statusData?.email?.resend_available_in]);

  const isMobileVerified = Boolean(statusData?.mobile?.verified || mobileVerifiedLocally);
  const isEmailVerified = Boolean(statusData?.email?.verified || emailVerifiedLocally);
  const isAllVerified = isMobileVerified && isEmailVerified;

  const isMobileLocked = mobileLockSeconds > 0;
  const isEmailLocked = emailLockSeconds > 0;

  // Handle Mobile Verify
  const handleVerifyMobile = (codeToVerify?: string) => {
    const code = (codeToVerify || mobileOtp).trim();
    if (code.length !== 6 || isMobileLocked || isMobileVerified) return;

    setMobileHasError(false);
    setMobileErrorMessage(null);

    verifyOtpMutation.mutate(
      { channel: 'mobile', otp: code },
      {
        onSuccess: (res) => {
          if (res.verified) {
            setMobileVerifiedLocally(true);
            setMobileOtp('');
          }
        },
        onError: (err: NormalizedApiError) => {
          setMobileHasError(true);
          if (err.code === 'too_many_attempts') {
            const retrySec = err.retry_after_seconds || 900;
            setMobileLockSeconds(retrySec);
            setMobileErrorMessage(
              t('otpVerification.errorTooManyAttempts', {
                minutes: Math.ceil(retrySec / 60),
              })
            );
          } else if (err.code === 'otp_expired') {
            setMobileErrorMessage(t('otpVerification.errorOtpExpired'));
          } else {
            setMobileErrorMessage(err.message || t('otpVerification.errorInvalidOtp'));
          }
        },
      }
    );
  };

  // Handle Email Verify
  const handleVerifyEmail = (codeToVerify?: string) => {
    const code = (codeToVerify || emailOtp).trim();
    if (code.length !== 6 || isEmailLocked || isEmailVerified) return;

    setEmailHasError(false);
    setEmailErrorMessage(null);

    verifyOtpMutation.mutate(
      { channel: 'email', otp: code },
      {
        onSuccess: (res) => {
          if (res.verified) {
            setEmailVerifiedLocally(true);
            setEmailOtp('');
          }
        },
        onError: (err: NormalizedApiError) => {
          setEmailHasError(true);
          if (err.code === 'too_many_attempts') {
            const retrySec = err.retry_after_seconds || 900;
            setEmailLockSeconds(retrySec);
            setEmailErrorMessage(
              t('otpVerification.errorTooManyAttempts', {
                minutes: Math.ceil(retrySec / 60),
              })
            );
          } else if (err.code === 'otp_expired') {
            setEmailErrorMessage(t('otpVerification.errorOtpExpired'));
          } else {
            setEmailErrorMessage(err.message || t('otpVerification.errorInvalidOtp'));
          }
        },
      }
    );
  };

  // Handle Resend Mobile OTP
  const handleResendMobile = () => {
    if (mobileResendSeconds > 0 || isMobileLocked || isMobileVerified) return;

    setMobileHasError(false);
    setMobileErrorMessage(null);

    resendOtpMutation.mutate(
      { channel: 'mobile' },
      {
        onSuccess: (res) => {
          setMobileCountdown(res.resend_available_in || 30);
          setMobileOtp('');
        },
        onError: (err: NormalizedApiError) => {
          if (err.code === 'too_many_resends') {
            setMobileErrorMessage(t('otpVerification.errorTooManyResends'));
          } else if (err.code === 'resend_too_soon') {
            setMobileCountdown(err.retry_after_seconds || 30);
          } else {
            setMobileErrorMessage(err.message || t('otpVerification.errorGeneric'));
          }
        },
      }
    );
  };

  // Handle Resend Email OTP
  const handleResendEmail = () => {
    if (emailResendSeconds > 0 || isEmailLocked || isEmailVerified) return;

    setEmailHasError(false);
    setEmailErrorMessage(null);

    resendOtpMutation.mutate(
      { channel: 'email' },
      {
        onSuccess: (res) => {
          setEmailCountdown(res.resend_available_in || 30);
          setEmailOtp('');
        },
        onError: (err: NormalizedApiError) => {
          if (err.code === 'too_many_resends') {
            setEmailErrorMessage(t('otpVerification.errorTooManyResends'));
          } else if (err.code === 'resend_too_soon') {
            setEmailCountdown(err.retry_after_seconds || 30);
          } else {
            setEmailErrorMessage(err.message || t('otpVerification.errorGeneric'));
          }
        },
      }
    );
  };

  // Proceed to seller onboarding
  const handleContinue = () => {
    if (isAllVerified) {
      navigate('/vendor/onboarding', { replace: true });
    }
  };

  if (isStatusLoading) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 shadow-lg border border-[#EAE5DB] text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#2E4D34] border-t-transparent animate-spin mx-auto" />
        <p className="text-sm font-medium text-[#637365]">Loading verification status...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#EAE5DB] text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#EAF1EA] text-[#2E4D34] mx-auto flex items-center justify-center relative">
          <ShieldCheck className="w-7 h-7" />
          {isAllVerified && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#2E4D34] text-white flex items-center justify-center text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#223B28] tracking-tight">
            {t('otpVerification.title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#637365] max-w-md mx-auto leading-relaxed">
            {t('otpVerification.subtitle')}
          </p>
        </div>
      </div>

      {/* Stacked Cards: 1. Mobile OTP Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#EAE5DB] space-y-5 transition-all">
        {/* Card Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-[#F4EFE6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EAE5DB] flex items-center justify-center text-[#2E4D34]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#223B28]">
                {t('otpVerification.mobileCardTitle')}
              </h2>
              <p className="text-xs text-[#637365]">
                {t('otpVerification.codeSentTo')}{' '}
                <span className="font-semibold text-[#1D251E]">
                  {statusData?.mobile?.masked || '+91 98XXXXXX21'}
                </span>
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {isMobileVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF1EA] text-[#2E4D34] border border-[#C4D3C2]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E4D34]" />
                {t('otpVerification.statusVerified')}
              </span>
            ) : isMobileLocked ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
                <Lock className="w-3.5 h-3.5" />
                {t('otpVerification.statusLocked')} ({Math.ceil(mobileLockSeconds / 60)}m)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF8EB] text-[#B45309] border border-[#FDE68A]">
                <Clock className="w-3.5 h-3.5" />
                {t('otpVerification.statusPending')}
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        {isMobileVerified ? (
          <div className="p-4 rounded-2xl bg-[#EAF1EA]/60 border border-[#D1DDD0] flex items-center gap-3 text-xs font-medium text-[#2E4D34]">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#2E4D34]" />
            <span>Mobile number successfully verified with 6-digit code.</span>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            <OtpInput
              idPrefix="mobile-otp"
              value={mobileOtp}
              onChange={(val) => {
                setMobileOtp(val);
                if (mobileHasError) {
                  setMobileHasError(false);
                  setMobileErrorMessage(null);
                }
              }}
              onComplete={(code) => handleVerifyMobile(code)}
              hasError={mobileHasError}
              errorMessage={mobileErrorMessage}
              disabled={isMobileLocked || verifyOtpMutation.isPending}
              autoFocus={true}
            />

            {/* Error Message */}
            {mobileErrorMessage && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-[#FFF8F7] border border-[#FAC7C3] flex items-center gap-2 text-xs text-[#DC2626] font-medium"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{mobileErrorMessage}</span>
              </div>
            )}

            {/* Actions: Resend and Verify */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleResendMobile}
                disabled={
                  mobileResendSeconds > 0 ||
                  isMobileLocked ||
                  resendOtpMutation.isPending
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E4D34] hover:text-[#223B28] disabled:text-[#9EB89D] disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    resendOtpMutation.isPending ? 'animate-spin' : ''
                  }`}
                />
                <span>
                  {mobileResendSeconds > 0
                    ? t('otpVerification.resendIn', { seconds: mobileResendSeconds })
                    : t('otpVerification.resendBtn')}
                </span>
              </button>

              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={
                  mobileOtp.length !== 6 ||
                  isMobileLocked ||
                  verifyOtpMutation.isPending
                }
                isLoading={verifyOtpMutation.isPending}
                loadingText={t('otpVerification.verifyingBtn')}
                onClick={() => handleVerifyMobile()}
              >
                {t('otpVerification.verifyBtn')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stacked Cards: 2. Email OTP Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#EAE5DB] space-y-5 transition-all">
        {/* Card Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-[#F4EFE6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EAE5DB] flex items-center justify-center text-[#2E4D34]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#223B28]">
                {t('otpVerification.emailCardTitle')}
              </h2>
              <p className="text-xs text-[#637365]">
                {t('otpVerification.codeSentTo')}{' '}
                <span className="font-semibold text-[#1D251E]">
                  {statusData?.email?.masked || 'ab***@gmail.com'}
                </span>
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {isEmailVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF1EA] text-[#2E4D34] border border-[#C4D3C2]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E4D34]" />
                {t('otpVerification.statusVerified')}
              </span>
            ) : isEmailLocked ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]">
                <Lock className="w-3.5 h-3.5" />
                {t('otpVerification.statusLocked')} ({Math.ceil(emailLockSeconds / 60)}m)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF8EB] text-[#B45309] border border-[#FDE68A]">
                <Clock className="w-3.5 h-3.5" />
                {t('otpVerification.statusPending')}
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        {isEmailVerified ? (
          <div className="p-4 rounded-2xl bg-[#EAF1EA]/60 border border-[#D1DDD0] flex items-center gap-3 text-xs font-medium text-[#2E4D34]">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#2E4D34]" />
            <span>Email address successfully verified with 6-digit code.</span>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            <OtpInput
              idPrefix="email-otp"
              value={emailOtp}
              onChange={(val) => {
                setEmailOtp(val);
                if (emailHasError) {
                  setEmailHasError(false);
                  setEmailErrorMessage(null);
                }
              }}
              onComplete={(code) => handleVerifyEmail(code)}
              hasError={emailHasError}
              errorMessage={emailErrorMessage}
              disabled={isEmailLocked || verifyOtpMutation.isPending}
            />

            {/* Error Message */}
            {emailErrorMessage && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-[#FFF8F7] border border-[#FAC7C3] flex items-center gap-2 text-xs text-[#DC2626] font-medium"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{emailErrorMessage}</span>
              </div>
            )}

            {/* Actions: Resend and Verify */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={
                  emailResendSeconds > 0 ||
                  isEmailLocked ||
                  resendOtpMutation.isPending
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E4D34] hover:text-[#223B28] disabled:text-[#9EB89D] disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    resendOtpMutation.isPending ? 'animate-spin' : ''
                  }`}
                />
                <span>
                  {emailResendSeconds > 0
                    ? t('otpVerification.resendIn', { seconds: emailResendSeconds })
                    : t('otpVerification.resendBtn')}
                </span>
              </button>

              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={
                  emailOtp.length !== 6 ||
                  isEmailLocked ||
                  verifyOtpMutation.isPending
                }
                isLoading={verifyOtpMutation.isPending}
                loadingText={t('otpVerification.verifyingBtn')}
                onClick={() => handleVerifyEmail()}
              >
                {t('otpVerification.verifyBtn')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions: Continue Button & Go Back Link */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#EAE5DB] space-y-4 text-center">
        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={!isAllVerified}
          onClick={handleContinue}
          className="w-full shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {t('otpVerification.continueBtn')}
        </Button>

        <div className="pt-2 border-t border-[#F4EFE6]">
          <Link
            to="/vendor/register"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#637365] hover:text-[#2E4D34] transition-colors focus:outline-none focus:ring-1 focus:ring-[#2E4D34] rounded px-2 py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('otpVerification.wrongDetailsLink')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VendorVerifyOtpPage;
