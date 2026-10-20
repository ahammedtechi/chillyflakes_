import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: React.ReactNode;
  hint?: string;
  required?: boolean;
  prefixText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      id,
      label,
      error,
      hint,
      required,
      prefixText,
      leftIcon,
      rightElement,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const describedBy = [
      error ? errorId : undefined,
      hint ? hintId : undefined,
    ].filter(Boolean).join(' ') || undefined;

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
        </label>

        <div className="relative flex items-center">
          {prefixText && (
            <span className="inline-flex items-center px-3 py-2.5 rounded-l-xl border border-r-0 border-[#EAE5DB] bg-[#FAF7F2] text-[#5F6D61] text-xs font-semibold select-none">
              {prefixText}
            </span>
          )}

          {leftIcon && !prefixText && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[#7E8F80]">
              {leftIcon}
            </div>
          )}

          <input
            {...props}
            id={id}
            ref={ref}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`w-full py-2.5 text-xs text-[#1D251E] placeholder:text-[#9EB89D]/70 bg-white transition-all duration-200 border ${
              prefixText ? 'rounded-r-xl' : 'rounded-xl'
            } ${leftIcon && !prefixText ? 'pl-9' : 'pl-3.5'} ${
              rightElement ? 'pr-10' : 'pr-3.5'
            } ${
              error
                ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20 bg-[#FFF8F7]'
                : 'border-[#EAE5DB] hover:border-[#C4D3C2] focus:border-[#2E4D34] focus:ring-2 focus:ring-[#2E4D34]/20'
            } disabled:bg-[#F5F6F2] disabled:cursor-not-allowed focus:outline-none ${className}`}
          />

          {rightElement && (
            <div className="absolute right-2.5 flex items-center">{rightElement}</div>
          )}
        </div>

        {hint && !error && (
          <p id={hintId} className="text-[11px] text-[#637365] leading-tight">
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

FormField.displayName = 'FormField';
export default FormField;
