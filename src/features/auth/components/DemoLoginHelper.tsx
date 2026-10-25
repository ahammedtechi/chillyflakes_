import React from 'react';
import { FlaskConical } from 'lucide-react';

interface DemoLoginHelperProps {
  onFill: (identifier: string, password: string) => void;
}

export const DemoLoginHelper: React.FC<DemoLoginHelperProps> = ({ onFill }) => {
  return (
    <div className="mt-5 p-3.5 rounded-2xl bg-[#FEF3C7]/60 border border-[#FDE68A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#92400E]">
      <div className="flex items-center gap-2">
        <FlaskConical className="w-4 h-4 flex-shrink-0 text-[#D97706]" />
        <div>
          <span className="font-semibold">Demo login: </span>
          <span className="font-mono bg-white/70 px-1.5 py-0.5 rounded text-[11px] text-[#78350F]">approved@test.com</span>
          <span className="mx-1 text-[#B45309]">/</span>
          <span className="font-mono bg-white/70 px-1.5 py-0.5 rounded text-[11px] text-[#78350F]">Test@123</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onFill('approved@test.com', 'Test@123')}
        className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold text-[#78350F] bg-white hover:bg-[#FEF3C7] border border-[#FCD34D] rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-[#D97706]"
      >
        Fill credentials
      </button>
    </div>
  );
};

export default DemoLoginHelper;
