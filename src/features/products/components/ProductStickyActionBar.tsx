import React from 'react';
import { Save, Send, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ProductStickyActionBarProps {
  isSavingDraft: boolean;
  isSubmitting: boolean;
  lastAutosavedAt: Date | null;
  hasUnsavedChanges: boolean;
  isPendingReview: boolean;
  onSaveDraft: () => void;
  onSubmitForReview: () => void;
  onWithdrawAndEdit?: () => void;
  onBack: () => void;
}

export const ProductStickyActionBar: React.FC<ProductStickyActionBarProps> = ({
  isSavingDraft,
  isSubmitting,
  lastAutosavedAt,
  hasUnsavedChanges,
  isPendingReview,
  onSaveDraft,
  onSubmitForReview,
  onWithdrawAndEdit,
  onBack,
}) => {
  return (
    <aside
      aria-label="Product submission controls"
      className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE5DB] shadow-lg py-3 px-4 sm:px-6 transition-all"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Back & Autosave Status */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F6D61] hover:text-[#2E4D34] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>

          {/* Status info */}
          <div className="flex items-center gap-2 text-[11px] text-[#5F6D61]">
            {lastAutosavedAt && (
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#2E4D34]" />
                Autosaved {lastAutosavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            {hasUnsavedChanges && !lastAutosavedAt && (
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Unsaved changes
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {isPendingReview ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                Locked for Super Admin review
              </span>
              {onWithdrawAndEdit && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onWithdrawAndEdit}
                  className="shrink-0"
                >
                  Withdraw & Edit
                </Button>
              )}
            </div>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="md"
                disabled={isSavingDraft || isSubmitting}
                isLoading={isSavingDraft}
                loadingText="Saving..."
                onClick={onSaveDraft}
                leftIcon={<Save className="w-4 h-4" />}
                className="w-1/2 sm:w-auto text-xs sm:text-sm font-semibold"
              >
                Save Draft
              </Button>

              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={isSavingDraft || isSubmitting}
                isLoading={isSubmitting}
                loadingText="Submitting..."
                onClick={onSubmitForReview}
                leftIcon={<Send className="w-4 h-4" />}
                className="w-1/2 sm:w-auto text-xs sm:text-sm font-semibold shadow-md bg-[#2E4D34] hover:bg-[#233B27]"
              >
                Submit for Review
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
