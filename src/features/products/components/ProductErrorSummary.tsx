import React, { useEffect, useRef } from 'react';
import { AlertTriangle, ArrowDownRight, X } from 'lucide-react';
import type { FormValidationErrorItem } from '../validation/productSchema';

interface ProductErrorSummaryProps {
  errors: FormValidationErrorItem[];
  onDismiss?: () => void;
}

export const ProductErrorSummary: React.FC<ProductErrorSummaryProps> = ({
  errors,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus and scroll to first error on mount or change
  useEffect(() => {
    if (errors.length > 0) {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Try focusing the first input
      const first = errors[0];
      const targetElement =
        document.getElementById(`product-${first.path}`) ||
        document.getElementById(first.path) ||
        document.getElementById(first.sectionId);

      if (targetElement) {
        setTimeout(() => {
          (targetElement as HTMLElement).focus?.();
        }, 300);
      }
    }
  }, [errors]);

  if (errors.length === 0) return null;

  const handleJumpToError = (item: FormValidationErrorItem) => {
    const el =
      document.getElementById(`product-${item.path}`) ||
      document.getElementById(item.path) ||
      document.getElementById(item.sectionId);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (el as HTMLElement).focus?.();
    }
  };

  return (
    <div
      ref={containerRef}
      role="alert"
      aria-labelledby="error-summary-title"
      tabIndex={-1}
      className="p-4 sm:p-5 rounded-2xl bg-red-50 border border-red-200 shadow-sm space-y-3 animate-in fade-in duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <h2 id="error-summary-title" className="text-sm font-bold">
            Please resolve the following {errors.length} {errors.length === 1 ? 'error' : 'errors'} before submitting:
          </h2>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 p-1 rounded-lg"
            aria-label="Dismiss error summary"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <ul className="space-y-1.5 pl-7 list-disc text-xs text-red-700">
        {errors.map((item, idx) => (
          <li key={idx}>
            <button
              type="button"
              onClick={() => handleJumpToError(item)}
              className="text-left font-medium hover:underline inline-flex items-center gap-1 group text-red-800"
            >
              <span>{item.message}</span>
              <ArrowDownRight className="w-3 h-3 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
