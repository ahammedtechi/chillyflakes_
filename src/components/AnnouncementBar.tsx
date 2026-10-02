import React from 'react';
import { Recycle, Truck, ShieldCheck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#172421] text-[#F1EFE5] text-[11px] font-medium tracking-luxury py-2.5 px-4 border-b border-[#2D403D]/60 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[#F1EFE5]/90">
            <Recycle className="w-3.5 h-3.5 text-[#8A9C82]" />
            <span className="uppercase text-[10px]">GIVE EVERYDAY ESSENTIALS A SECOND LIFE</span>
          </span>
          <span className="hidden md:inline text-[#355247]">|</span>
          <span className="hidden md:inline-flex items-center gap-1.5 text-[#F1EFE5]/80">
            <Truck className="w-3.5 h-3.5 text-[#607A69]" />
            <span className="uppercase text-[10px]">PLASTIC-FREE DOORSTEP DELIVERY</span>
          </span>
          <span className="hidden lg:inline text-[#355247]">|</span>
          <span className="hidden lg:inline-flex items-center gap-1.5 text-[#8A9C82]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8A9C82]" />
            <span className="uppercase text-[10px]">INSPECTED & SANITIZED QUALITY</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-[#A5B59E] uppercase tracking-wider">
          <span className="hidden sm:inline hover:text-[#F1EFE5] transition-colors">
            Free shipping over ₹499
          </span>
          <span className="text-[#355247] hidden sm:inline">/</span>
          <span className="text-[#F1EFE5]/90">Old Wooden Store • Online</span>
        </div>
      </div>
    </div>
  );
};
