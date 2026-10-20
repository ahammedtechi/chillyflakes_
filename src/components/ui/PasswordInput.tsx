import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { evaluatePassword, type PasswordAnalysis } from '../../lib/passwordStrength';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  showStrengthMeter?: boolean;
  onAnalysisChange?: (analysis: PasswordAnalysis) => void;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      id,
      label,
      error,
      hint,
      required,
      showStrengthMeter = false,
      value,
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const stringVal = typeof value === 'string' ? value : '';
    const analysis = evaluatePassword(stringVal);

    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const strengthId = `${id}-strength`;

    const describedBy = [
      error ? errorId : undefined,
      hint ? hintId : undefined,
      showStrengthMeter ? strengthId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    // Strength level configuration
    const getLevelConfig = () => {
      switch (analysis.level) {
        case 'weak':
          return { label: t('form.strength_weak'), color: 'bg-[#DC2626]', text: 'text-[#DC2626]', bars: 1 };
        case 'fair':
          return { label: t('form.strength_fair'), color: 'bg-[#E29D38]', text: 'text-[#E29D38]', bars: 2 };
        case 'good':
          return { label: t('form.strength_good'), color: 'bg-[#5F8562]', text: 'text-[#5F8562]', bars: 3 };
        case 'strong':
          return { label: t('form.strength_strong'), color: 'bg-[#2E4D34]', text: 'text-[#2E4D34]', bars: 4 };
        default:
          return { label: '', color: 'bg-[#E2E7E0]', text: 'text-[#7E8F80]', bars: 0 };
      }
    };

    const config = getLevelConfig();

    return (
      <div className="w-full flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="text-xs font-semibold text-[#223B28] flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-[#DC2626] ml-1">*</span>}
          </span>
          {showStrengthMeter && stringVal.length > 0 && (
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${config.text}`}>
              {config.label}
            </span>
          )}
        </label>

        <div className="relative flex items-center">
          <input
            {...props}
            id={id}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`w-full py-2.5 pl-3.5 pr-10 text-xs text-[#1D251E] placeholder:text-[#9EB89D]/70 bg-white rounded-xl transition-all duration-200 border ${
              error
                ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 bg-[#FFF8F7]'
                : 'border-[#EAE5DB] hover:border-[#C4D3C2] focus:border-[#2E4D34] focus:ring-2 focus:ring-[#2E4D34]/20'
            } focus:outline-none ${className}`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? t('form.hidePassword') : t('form.showPassword')}
            className="absolute right-3 p-1 text-[#7E8F80] hover:text-[#2E4D34] transition-colors focus:outline-none focus:ring-1 focus:ring-[#2E4D34] rounded"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Live Strength Meter */}
        {showStrengthMeter && stringVal.length > 0 && (
          <div id={strengthId} className="flex flex-col gap-2 pt-1 animate-in fade-in duration-150">
            {/* 4 Multi-segment strength bars */}
            <div className="grid grid-cols-4 gap-1.5 h-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-full rounded-full transition-all duration-300 ${
                    step <= config.bars ? config.color : 'bg-[#EAE5DB]'
                  }`}
                />
              ))}
            </div>

            {/* Granular Criteria Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-1 text-[10px] text-[#637365] pt-0.5">
              <span className={`flex items-center gap-1 ${analysis.criteria.hasMinLength ? 'text-[#2E4D34] font-medium' : ''}`}>
                {analysis.criteria.hasMinLength ? <Check className="w-3 h-3 text-[#2E4D34]" /> : <X className="w-3 h-3 text-[#A3B3A5]" />}
                {t('form.rule_min')}
              </span>
              <span className={`flex items-center gap-1 ${analysis.criteria.hasUpper ? 'text-[#2E4D34] font-medium' : ''}`}>
                {analysis.criteria.hasUpper ? <Check className="w-3 h-3 text-[#2E4D34]" /> : <X className="w-3 h-3 text-[#A3B3A5]" />}
                {t('form.rule_upper')}
              </span>
              <span className={`flex items-center gap-1 ${analysis.criteria.hasLower ? 'text-[#2E4D34] font-medium' : ''}`}>
                {analysis.criteria.hasLower ? <Check className="w-3 h-3 text-[#2E4D34]" /> : <X className="w-3 h-3 text-[#A3B3A5]" />}
                {t('form.rule_lower')}
              </span>
              <span className={`flex items-center gap-1 ${analysis.criteria.hasNumber ? 'text-[#2E4D34] font-medium' : ''}`}>
                {analysis.criteria.hasNumber ? <Check className="w-3 h-3 text-[#2E4D34]" /> : <X className="w-3 h-3 text-[#A3B3A5]" />}
                {t('form.rule_number')}
              </span>
              <span className={`flex items-center gap-1 ${analysis.criteria.hasSpecial ? 'text-[#2E4D34] font-medium' : ''}`}>
                {analysis.criteria.hasSpecial ? <Check className="w-3 h-3 text-[#2E4D34]" /> : <X className="w-3 h-3 text-[#A3B3A5]" />}
                {t('form.rule_special')}
              </span>
            </div>
          </div>
        )}

        {hint && !error && !showStrengthMeter && (
          <p id={hintId} className="text-[11px] text-[#637365]">
            {hint}
          </p>
        )}

        {error && (
          <div
            id={errorId}
            role="alert"
            className="flex items-center gap-1.5 text-[11px] text-[#DC2626] font-medium animate-in fade-in duration-150"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
