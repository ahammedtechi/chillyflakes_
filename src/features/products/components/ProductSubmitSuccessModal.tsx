import React from 'react';
import { CheckCircle2, PackageCheck, ArrowRight, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ProductSubmitSuccessModalProps {
  isOpen: boolean;
  productTitle: string;
  onViewProducts: () => void;
  onAddAnother: () => void;
}

export const ProductSubmitSuccessModal: React.FC<ProductSubmitSuccessModalProps> = ({
  isOpen,
  productTitle,
  onViewProducts,
  onAddAnother,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-success-title"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#EAE5DB] text-center space-y-6 animate-in zoom-in-95 duration-200">
        {/* Animated Celebration Icon */}
        <div className="mx-auto w-16 h-16 rounded-3xl bg-[#EAF1EA] border border-[#D1DDD0] flex items-center justify-center text-[#2E4D34] shadow-sm">
          <PackageCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF1EA] text-[#2E4D34] text-xs font-bold border border-[#D1DDD0]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Submission Received</span>
          </div>

          <h2 id="submit-success-title" className="text-xl sm:text-2xl font-bold text-[#1D251E]">
            Your product was submitted
          </h2>

          <p className="text-sm text-[#5F6D61] leading-relaxed max-w-md mx-auto">
            ChillyFlakes will review <strong className="text-[#223B28]">"{productTitle || 'your product'}"</strong> before it goes live. This ensures high catalog authenticity and usually takes 1–2 business days.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE5DB] text-left text-xs text-[#5F6D61] space-y-2">
          <span className="font-bold text-[#223B28] block">What happens next?</span>
          <ul className="list-disc list-inside space-y-1">
            <li>Platform super admins review your photography, materials, and description.</li>
            <li>You will receive an email and in-app dashboard notification once approved.</li>
            <li>If any adjustments are needed, specific feedback will be provided to help you resubmit.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onViewProducts}
            leftIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto text-xs sm:text-sm font-semibold"
          >
            View My Products
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onAddAnother}
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto text-xs sm:text-sm font-semibold bg-[#2E4D34] hover:bg-[#233B27]"
          >
            Add Another Product
          </Button>
        </div>
      </div>
    </div>
  );
};
