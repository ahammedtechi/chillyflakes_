import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ProductReReviewConfirmModalProps {
  isOpen: boolean;
  changedReviewFields: string[];
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProductReReviewConfirmModal: React.FC<ProductReReviewConfirmModalProps> = ({
  isOpen,
  changedReviewFields,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rereview-modal-title"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#EAE5DB] space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-amber-700" />
          </div>
          <div className="space-y-1">
            <h2 id="rereview-modal-title" className="text-base sm:text-lg font-bold text-[#1D251E]">
              Content Changes Require Admin Re-Review
            </h2>
            <p className="text-xs text-[#5F6D61] leading-relaxed">
              This product is currently <strong>Live & Approved</strong> on the ChillyFlakes marketplace. Editing core content sends the listing back to <strong>Pending Review</strong> until platform admins re-verify it.
            </p>
          </div>
        </div>

        {/* List of changes that require review */}
        <div className="p-4 rounded-2xl bg-[#FFFBF0] border border-amber-200/80 space-y-2">
          <span className="text-xs font-bold text-amber-900 block">
            The following modifications trigger super-admin review:
          </span>
          <ul className="text-xs text-amber-800 space-y-1.5 list-disc list-inside">
            {changedReviewFields.map((field, idx) => (
              <li key={idx}>
                <strong>{field}</strong> was modified
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE5DB] text-[11px] text-[#5F6D61]">
          <strong>Note:</strong> Price, stock quantity, shipping dimensions, and wholesale pricing updates take effect immediately without requiring review.
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={isLoading}
            onClick={onCancel}
            className="text-xs font-semibold"
          >
            Cancel & Keep Editing
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={isLoading}
            isLoading={isLoading}
            loadingText="Submitting..."
            onClick={onConfirm}
            className="text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white"
          >
            Accept & Submit for Re-Review
          </Button>
        </div>
      </div>
    </div>
  );
};
