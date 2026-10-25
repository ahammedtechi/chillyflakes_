import React, { useState } from 'react';
import { X, FlaskConical } from 'lucide-react';

/**
 * Thin, dismissible banner shown at the top of the vendor portal in demo mode.
 * Only rendered when VITE_DEMO_MODE === 'true'.
 * State lives in memory — banner reappears on page refresh.
 */
export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-[60] flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-[#92400E] bg-gradient-to-r from-[#FEF3C7] via-[#FDE68A] to-[#FEF3C7] border-b border-[#F59E0B]/30 shadow-sm"
    >
      <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" />
      <span>Demo mode: sample data only. Changes are not saved.</span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="ml-2 p-0.5 rounded-md hover:bg-[#F59E0B]/20 transition-colors focus:outline-none focus:ring-1 focus:ring-[#92400E]"
        aria-label="Dismiss demo banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default DemoBanner;
