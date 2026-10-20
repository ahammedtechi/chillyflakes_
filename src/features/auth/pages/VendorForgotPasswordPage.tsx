import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Lock,
  Mail,
  AlertCircle,
  RefreshCw,
  Edit2,
} from 'lucide-react';

import {
  createPasswordResetRequestSchema,
  createPasswordResetConfirmSchema,
  type PasswordResetRequestFormData,
  type PasswordResetConfirmFormData,
} from '../schemas/vendorForgotPasswordSchema';
import { usePasswordResetRequest } from '../hooks/usePasswordResetRequest';
import { usePasswordResetVerify } from '../hooks/usePasswordResetVerify';
import { usePasswordResetResend } from '../hooks/usePasswordResetResend';
import { usePasswordResetConfirm } from '../hooks/usePasswordResetConfirm';
import { usePasswordResetStatus } from '../hooks/usePasswordResetStatus';
import { FormField } from '../../../components/ui/FormField';
import { OtpInput } from '../../../components/ui/OtpInput';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { Button } from '../../../components/ui/Button';
import type { NormalizedApiError } from '../../../types/auth';

type ResetStep = 1 | 2 | 3 | 'success';

export const VendorForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Wizard step state
  const [currentStep, setCurrentStep] = useState<ResetStep>(1);
  const [maskedIdentifier, setMaskedIdentifier] = useState<string>('');
  const [bannerError, setBannerError] = useState<string | null>(null);

  // Step 2: OTP State
  const [otp, setOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState<number>(30);
  const [lockSeconds, setLockSeconds] = useState<number>(0);

  // Success step: Auto-redirect countdown
  const [redirectCountdown, setRedirectCountdown] = useState<number>(5);

  // Mutations
  const requestMutation = usePasswordResetRequest();
  const verifyMutation = usePasswordResetVerify();
  const resendMutation = usePasswordResetResend();
  const confirmMutation = usePasswordResetConfirm();

  // Status query for page refresh resilience
  const { data: statusData } = usePasswordResetStatus();

  // Sync step if user refreshes page while session is active
  useEffect(() => {
    if (statusData && currentStep === 1) {
      if (statusData.step === 'new_password') {
        const timer = setTimeout(() => setCurrentStep(3), 0);
        return () => clearTimeout(timer);
      } else if (statusData.step === 'verify') {
        const timer = setTimeout(() => setCurrentStep(2), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [statusData, currentStep]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Lock countdown timer
  useEffect(() => {
    if (lockSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockSeconds]);

  // Redirect countdown timer on success step
  useEffect(() => {
    if (currentStep !== 'success') return;
    if (redirectCountdown <= 0) {
      navigate('/vendor/login', { replace: true });
      return;
    }
    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/vendor/login', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep, redirectCountdown, navigate]);

  // Form handling for Step 1
  const requestSchema = useMemo(() => createPasswordResetRequestSchema(t), [t]);
  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: requestErrors },
    getValues: getRequestValues,
  } = useForm<PasswordResetRequestFormData>({
    resolver: zodResolver(requestSchema),
    mode: 'onBlur',
    defaultValues: {
      identifier: '',
    },
  });

  // Form handling for Step 3
  const confirmSchema = useMemo(() => createPasswordResetConfirmSchema(t), [t]);
  const {
    handleSubmit: handleSubmitConfirm,
    control: controlConfirm,
    setError: setConfirmError,
    formState: { errors: confirmErrors },
  } = useForm<PasswordResetConfirmFormData>({
    resolver: zodResolver(confirmSchema),
    mode: 'onBlur',
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
  });

  // Handler for Step 1 Submit
  const onRequestSubmit = async (data: PasswordResetRequestFormData) => {
    setBannerError(null);
    try {
      const response = await requestMutation.mutateAsync({
        identifier: data.identifier.trim(),
      });
      setMaskedIdentifier(response.masked);
      setResendCountdown(response.resend_available_in || 30);
      setOtp('');
      setOtpError(null);
      setCurrentStep(2);
    } catch (err) {
      const apiErr = err as NormalizedApiError;
      setBannerError(apiErr.message || t('passwordReset.errorGeneric'));
    }
  };

  // Handler for Step 2 Submit
  const handleVerifyOtp = useCallback(async () => {
    if (otp.length !== 6 || lockSeconds > 0 || verifyMutation.isPending) {
      return;
    }
    setOtpError(null);
    setBannerError(null);

    try {
      await verifyMutation.mutateAsync({ otp });
      setCurrentStep(3);
    } catch (err) {
      const apiErr = err as NormalizedApiError;
      if (apiErr.code === 'too_many_attempts') {
        const wait = apiErr.retry_after_seconds || 900;
        setLockSeconds(wait);
        setOtpError(
          t('passwordReset.errorTooManyAttempts', {
            minutes: Math.ceil(wait / 60),
          })
        );
      } else if (apiErr.code === 'otp_expired') {
        setOtpError(t('passwordReset.errorOtpExpired'));
      } else if (apiErr.code === 'reset_session_expired') {
        setBannerError(t('passwordReset.errorSessionExpired'));
        setCurrentStep(1);
      } else {
        setOtpError(t('passwordReset.errorInvalidOtp'));
      }
    }
  }, [otp, lockSeconds, verifyMutation, t]);

  // Handler for Step 2 Resend
  const handleResendOtp = async () => {
    if (resendCountdown > 0 || lockSeconds > 0 || resendMutation.isPending) {
      return;
    }
    setOtpError(null);
    setBannerError(null);

    try {
      const response = await resendMutation.mutateAsync();
      setResendCountdown(response.resend_available_in || 30);
      setOtp('');
    } catch (err) {
      const apiErr = err as NormalizedApiError;
      if (apiErr.code === 'too_many_resends') {
        setOtpError(t('passwordReset.errorTooManyResends'));
      } else if (apiErr.code === 'resend_too_soon') {
        const wait = apiErr.retry_after_seconds || 30;
        setResendCountdown(wait);
        setOtpError(t('passwordReset.errorResendTooSoon', { seconds: wait }));
      } else if (apiErr.code === 'reset_session_expired') {
        setBannerError(t('passwordReset.errorSessionExpired'));
        setCurrentStep(1);
      } else {
        setOtpError(apiErr.message || t('passwordReset.errorGeneric'));
      }
    }
  };

  // Handler for Step 3 Submit
  const onConfirmSubmit = async (data: PasswordResetConfirmFormData) => {
    setBannerError(null);
    try {
      await confirmMutation.mutateAsync({
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });
      setCurrentStep('success');
      setRedirectCountdown(5);
    } catch (err) {
      const apiErr = err as NormalizedApiError;
      if (apiErr.code === 'password_reused') {
        setConfirmError('new_password', {
          type: 'manual',
          message: t('passwordReset.errorPasswordReused'),
        });
      } else if (apiErr.code === 'reset_session_expired') {
        setBannerError(t('passwordReset.errorSessionExpired'));
        setCurrentStep(1);
      } else {
        setBannerError(apiErr.message || t('passwordReset.errorGeneric'));
      }
    }
  };

  // Step labels for Stepper
  const stepsConfig = [
    { number: 1, label: t('passwordReset.step1_label') },
    { number: 2, label: t('passwordReset.step2_label') },
    { number: 3, label: t('passwordReset.step3_label') },
  ];

  return (
    <div className="w-full flex items-center justify-center py-4">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-[#EAE5DB] space-y-6">
        {/* Top Stepper Indicator */}
        {currentStep !== 'success' && (
          <nav aria-label="Progress" className="mb-2">
            <ol className="flex items-center justify-between relative">
              {stepsConfig.map((s, index) => {
                const isCompleted =
                  typeof currentStep === 'number'
                    ? currentStep > s.number
                    : true;
                const isCurrent = currentStep === s.number;

                return (
                  <li
                    key={s.number}
                    className="flex-1 flex flex-col items-center relative"
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {/* Connecting line */}
                    {index > 0 && (
                      <div
                        className={`absolute top-4 -left-1/2 w-full h-[2px] -translate-y-1/2 -z-0 transition-colors ${
                          isCompleted || isCurrent
                            ? 'bg-[#2E4D34]'
                            : 'bg-[#EAE5DB]'
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        isCompleted
                          ? 'bg-[#2E4D34] text-white shadow-sm'
                          : isCurrent
                          ? 'bg-[#2E4D34] text-white ring-4 ring-[#EAF1EA] shadow-sm'
                          : 'bg-white border-2 border-[#D1DDD0] text-[#637365]'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        s.number
                      )}
                    </div>

                    <span
                      className={`mt-2 text-[11px] sm:text-xs font-medium text-center truncate max-w-[90px] ${
                        isCurrent
                          ? 'text-[#2E4D34] font-semibold'
                          : isCompleted
                          ? 'text-[#223B28]'
                          : 'text-[#8E9B90]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {/* Global Banner Error */}
        {bannerError && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-[#FFF8F7] border border-[#F8D7DA] text-xs text-[#DC2626] flex items-start gap-2.5 animate-fadeIn"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{bannerError}</span>
          </div>
        )}

        {/* STEP 1: Request Code */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF1EA] text-[#2E4D34] mx-auto flex items-center justify-center shadow-xs">
                <KeyRound className="w-7 h-7" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#223B28]">
                {t('passwordReset.step1_title')}
              </h1>
              <p className="text-xs sm:text-sm text-[#637365] leading-relaxed max-w-sm mx-auto">
                {t('passwordReset.step1_desc')}
              </p>
            </div>

            <form
              onSubmit={handleSubmitRequest(onRequestSubmit)}
              noValidate
              className="space-y-5"
            >
              <FormField
                id="reset-identifier"
                label={t('login.identifierLabel')}
                error={requestErrors.identifier?.message}
                required
                autoComplete="username"
                placeholder={t('login.identifierPlaceholder')}
                {...registerRequest('identifier')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={requestMutation.isPending}
              >
                {requestMutation.isPending
                  ? t('passwordReset.step1_submitting')
                  : t('passwordReset.step1_button')}
              </Button>

              <div className="pt-2 text-center">
                <Link
                  to="/vendor/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F6D61] hover:text-[#2E4D34] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('passwordReset.backToLogin')}</span>
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Verify OTP */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF1EA] text-[#2E4D34] mx-auto flex items-center justify-center shadow-xs">
                <Mail className="w-7 h-7" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#223B28]">
                {t('passwordReset.step2_title')}
              </h1>
              <p className="text-xs sm:text-sm text-[#637365] leading-relaxed max-w-sm mx-auto">
                {t('passwordReset.step2_desc', {
                  masked: maskedIdentifier || getRequestValues('identifier'),
                })}
              </p>
              <button
                type="button"
                onClick={() => {
                  setOtp('');
                  setOtpError(null);
                  setCurrentStep(1);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E4D34] hover:underline pt-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>{t('passwordReset.changeIdentifier')}</span>
              </button>
            </div>

            {/* Lockout Banner */}
            {lockSeconds > 0 && (
              <div
                role="alert"
                className="p-3.5 rounded-2xl bg-[#FAF3E0] border border-[#F3E2B8] text-xs text-[#8A5A00] flex items-center gap-2"
              >
                <Lock className="w-4 h-4 flex-shrink-0" />
                <span>
                  {t('passwordReset.errorTooManyAttempts', {
                    minutes: Math.ceil(lockSeconds / 60),
                  })}
                </span>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex justify-center">
                <OtpInput
                  idPrefix="password-reset-otp"
                  length={6}
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    if (otpError) setOtpError(null);
                  }}
                  onComplete={() => {
                    if (lockSeconds === 0) {
                      handleVerifyOtp();
                    }
                  }}
                  hasError={!!otpError}
                  errorMessage={otpError}
                  disabled={lockSeconds > 0 || verifyMutation.isPending}
                  autoFocus={true}
                />
              </div>

              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6 || lockSeconds > 0}
                isLoading={verifyMutation.isPending}
              >
                {verifyMutation.isPending
                  ? t('passwordReset.verifyingButton')
                  : t('passwordReset.verifyButton')}
              </Button>

              {/* Resend section */}
              <div className="flex items-center justify-between pt-2 border-t border-[#EAE5DB] text-xs">
                <span className="text-[#637365]">
                  {resendCountdown > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[#8E9B90]">
                      <Clock className="w-3.5 h-3.5" />
                      {t('passwordReset.resendIn', {
                        seconds: resendCountdown,
                      })}
                    </span>
                  ) : (
                    <span>Didn&apos;t receive code?</span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={
                    resendCountdown > 0 ||
                    lockSeconds > 0 ||
                    resendMutation.isPending
                  }
                  className={`inline-flex items-center gap-1 font-semibold transition-colors ${
                    resendCountdown > 0 ||
                    lockSeconds > 0 ||
                    resendMutation.isPending
                      ? 'text-[#B0B8B1] cursor-not-allowed'
                      : 'text-[#2E4D34] hover:underline'
                  }`}
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      resendMutation.isPending ? 'animate-spin' : ''
                    }`}
                  />
                  <span>{t('passwordReset.resendButton')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Set New Password */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF1EA] text-[#2E4D34] mx-auto flex items-center justify-center shadow-xs">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#223B28]">
                {t('passwordReset.step3_title')}
              </h1>
              <p className="text-xs sm:text-sm text-[#637365] leading-relaxed max-w-sm mx-auto">
                {t('passwordReset.step3_desc')}
              </p>
            </div>

            <form
              onSubmit={handleSubmitConfirm(onConfirmSubmit)}
              noValidate
              className="space-y-5"
            >
              <Controller
                name="new_password"
                control={controlConfirm}
                render={({ field }) => (
                  <PasswordInput
                    id="new-password"
                    label={t('passwordReset.newPasswordLabel')}
                    placeholder={t('passwordReset.newPasswordPlaceholder')}
                    required
                    showStrengthMeter={true}
                    error={confirmErrors.new_password?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="confirm_password"
                control={controlConfirm}
                render={({ field }) => (
                  <PasswordInput
                    id="confirm-password"
                    label={t('passwordReset.confirmPasswordLabel')}
                    placeholder={t('passwordReset.confirmPasswordPlaceholder')}
                    required
                    error={confirmErrors.confirm_password?.message}
                    {...field}
                  />
                )}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={confirmMutation.isPending}
              >
                {confirmMutation.isPending
                  ? t('passwordReset.resettingButton')
                  : t('passwordReset.resetButton')}
              </Button>
            </form>
          </div>
        )}

        {/* SUCCESS STATE */}
        {currentStep === 'success' && (
          <div className="text-center space-y-6 py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#EAF1EA] text-[#2E4D34] mx-auto flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-[#2E4D34]" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#223B28]">
                {t('passwordReset.successTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-[#637365] leading-relaxed max-w-sm mx-auto">
                {t('passwordReset.successMessage')}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE5DB] text-xs text-[#5F6D61]">
              {t('passwordReset.redirecting', { seconds: redirectCountdown })}
            </div>

            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigate('/vendor/login', { replace: true })}
              >
                {t('passwordReset.goToLogin')}
              </Button>
            </div>
          </div>
        )}

        {/* Small Bottom Help Link */}
        <div className="pt-4 border-t border-[#EAE5DB] text-center text-xs text-[#8E9B90]">
          <span>{t('passwordReset.helpPrompt')} </span>
          <a
            href="mailto:sellers@chillyflakes.in"
            className="text-[#2E4D34] font-semibold underline hover:text-[#1e3322] transition-colors"
          >
            sellers@chillyflakes.in
          </a>
        </div>
      </div>
    </div>
  );
};

export default VendorForgotPasswordPage;
