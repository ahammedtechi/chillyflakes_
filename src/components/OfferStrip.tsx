import React from 'react';
import { ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

export const OfferStrip: React.FC = () => {
  return (
    <section className="max-w-[1360px] mx-auto px-2 sm:px-4 py-2">
      <div className="bg-[#1E2D2A] rounded-lg border border-[#355247] p-3 sm:p-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-[#F1EFE5] shadow-forest-sm">
        
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#263936] border border-[#355247] text-[#8A9C82] flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#F1EFE5] leading-none">Chilly Assured</p>
            <p className="text-[11px] text-[#8A9C82] mt-0.5">100% Sanitized & Tested</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#263936] border border-[#355247] text-[#8A9C82] flex items-center justify-center flex-shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#F1EFE5] leading-none">Free Delivery</p>
            <p className="text-[11px] text-[#8A9C82] mt-0.5">On orders above ₹499</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#263936] border border-[#355247] text-[#8A9C82] flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#F1EFE5] leading-none">7 Days Replacement</p>
            <p className="text-[11px] text-[#8A9C82] mt-0.5">Hassle-free doorstep pickup</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#263936] border border-[#355247] text-[#8A9C82] flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#F1EFE5] leading-none">Special Savings</p>
            <p className="text-[11px] text-[#8A9C82] mt-0.5">Extra 10% off with code EARTHY10</p>
          </div>
        </div>

      </div>
    </section>
  );
};
