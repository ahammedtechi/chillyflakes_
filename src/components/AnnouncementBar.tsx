import React from 'react';
import { Recycle, Truck, ShieldCheck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#3C4A3E] text-[#F1F5EF] text-[11px] font-medium py-2 px-4 border-b border-[#313E33] relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-white">
            <Recycle className="w-3.5 h-3.5 text-[#C4D3C2]" />
            <span className="uppercase text-[10px] tracking-wider">Mindfully Crafted Kitchenware & Circular Homeware</span>
          </span>
          <span className="hidden md:inline text-[#556957]">|</span>
          <span className="hidden md:inline-flex items-center gap-1.5 text-[#E4EBE2]/90">
            <Truck className="w-3.5 h-3.5 text-[#C4D3C2]" />
            <span className="uppercase text-[10px] tracking-wider">Doorstep Express Delivery</span>
          </span>
          <span className="hidden lg:inline text-[#556957]">|</span>
          <span className="hidden lg:inline-flex items-center gap-1.5 text-[#C4D3C2]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C4D3C2]" />
            <span className="uppercase text-[10px] tracking-wider">Certified 7-Day Guarantee</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-[#ECDBC2] uppercase tracking-wider">
          <span className="hidden sm:inline hover:text-white transition-colors">
            Free shipping over ₹499
          </span>
          <span className="text-[#556957] hidden sm:inline">•</span>
          <span className="text-white">Chilly Flakes</span>
        </div>
      </div>
    </div>
  );
};
