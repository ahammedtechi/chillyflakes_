import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface OtpInputProps {
  idPrefix: string;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  hasError?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  idPrefix,
  value,
  onChange,
  onComplete,
  length = 6,
  hasError = false,
  errorMessage,
  disabled = false,
  autoFocus = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isShaking, setIsShaking] = useState(false);

  // Split string into array of characters
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  // Handle shake animation and auto-clear + refocus on error
  useEffect(() => {
    if (hasError && !disabled) {
      const startTimer = setTimeout(() => setIsShaking(true), 0);
      const resetTimer = setTimeout(() => {
        setIsShaking(false);
        onChange('');
        inputRefs.current[0]?.focus();
      }, 500);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(resetTimer);
      };
    }
  }, [hasError, disabled, onChange]);

  // Autofocus the first input on mount if requested
  const hasFocusedRef = useRef(false);
  useEffect(() => {
    if (autoFocus && !disabled && !hasFocusedRef.current) {
      hasFocusedRef.current = true;
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus, disabled]);

  const updateDigit = useCallback(
    (index: number, newChar: string) => {
      const newDigits = [...digits];
      newDigits[index] = newChar;
      const combined = newDigits.join('');
      onChange(combined);

      if (newChar && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (combined.length === length && !combined.includes('')) {
        onComplete?.(combined);
      }
    },
    [digits, length, onChange, onComplete]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (!rawVal) {
      updateDigit(index, '');
      return;
    }
    // Take the newest character
    const char = rawVal[rawVal.length - 1];
    updateDigit(index, char);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        e.preventDefault();
        updateDigit(index - 1, '');
        inputRefs.current[index - 1]?.focus();
      } else {
        updateDigit(index, '');
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    onChange(pasted);
    const targetFocus = Math.min(pasted.length, length - 1);
    inputRefs.current[targetFocus]?.focus();

    if (pasted.length === length) {
      onComplete?.(pasted);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <style>{`
        @keyframes otpShakeAnim {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .otp-shake-active {
          animation: otpShakeAnim 0.45s ease-in-out;
        }
      `}</style>

      <div
        className={`flex items-center justify-center gap-2 sm:gap-3 transition-transform ${
          isShaking ? 'otp-shake-active' : ''
        }`}
        role="group"
        aria-label="One-time password input"
      >
        {Array.from({ length }).map((_, index) => {
          const digit = digits[index];
          const isErrorState = hasError || isShaking;

          return (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              id={`${idPrefix}-digit-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={digit}
              disabled={disabled}
              aria-label={`Digit ${index + 1} of ${length}`}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl transition-all duration-150 focus:outline-none select-none border ${
                disabled
                  ? 'bg-[#F5F6F2] text-[#8C9B8E] border-[#EAE5DB] cursor-not-allowed'
                  : isErrorState
                    ? 'border-[#DC2626] bg-[#FFF8F7] text-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
                    : digit
                      ? 'border-[#2E4D34] bg-white text-[#223B28] focus:ring-2 focus:ring-[#2E4D34]/20'
                      : 'border-[#D1DDD0] bg-white text-[#1D251E] hover:border-[#9EB89D] focus:border-[#2E4D34] focus:ring-2 focus:ring-[#2E4D34]/20'
              }`}
            />
          );
        })}
      </div>

      {/* Screen reader live announcements for errors */}
      <div aria-live="polite" className="sr-only">
        {errorMessage || ''}
      </div>
    </div>
  );
};

export default OtpInput;
