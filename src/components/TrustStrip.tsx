import React from 'react';
import { Recycle, IndianRupee, SearchCheck, Truck } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section className="bg-white text-[#1D251E] py-14 sm:py-20 border-y border-[#E5EAE2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Text Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-baseline pb-12 border-b border-[#EEF2EB]">
          <div className="lg:col-span-6">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#3C4A3E] block mb-2">
              THE CHILLY FLAKES PURPOSE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1D251E] leading-tight tracking-tight">
              Good Things <br />
              <span className="italic font-normal text-[#3C4A3E]">Deserve Another Home.</span>
            </h2>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-end">
            <p className="text-base sm:text-lg text-[#5F6D61] font-normal leading-relaxed max-w-xl">
              Chilly Flakes brings together useful kitchen and household products that 
              are ready for everyday life — without unnecessary waste or unnecessary cost. 
              We curate seasoned kitchenware, tested daily tools, and durable homeware meant to be held, used, and cherished.
            </p>
          </div>
        </div>

        {/* 4 Minimal Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-10">
          
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F0F4EE] text-[#3C4A3E] flex items-center justify-center border border-[#D5E1D3]">
              <Recycle className="w-5 h-5 text-[#3C4A3E]" />
            </div>
            <h3 className="font-serif text-sm font-bold tracking-wide uppercase text-[#1D251E]">
              Second Life
            </h3>
            <p className="text-xs text-[#5F6D61] leading-relaxed">
              Useful products deserve another home instead of a landfill.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F0F4EE] text-[#3C4A3E] flex items-center justify-center border border-[#D5E1D3]">
              <IndianRupee className="w-5 h-5 text-[#3C4A3E]" />
            </div>
            <h3 className="font-serif text-sm font-bold tracking-wide uppercase text-[#1D251E]">
              Better Value
            </h3>
            <p className="text-xs text-[#5F6D61] leading-relaxed">
              Quality kitchen essentials at honest, uninflated prices.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F0F4EE] text-[#3C4A3E] flex items-center justify-center border border-[#D5E1D3]">
              <SearchCheck className="w-5 h-5 text-[#3C4A3E]" />
            </div>
            <h3 className="font-serif text-sm font-bold tracking-wide uppercase text-[#1D251E]">
              Carefully Checked
            </h3>
            <p className="text-xs text-[#5F6D61] leading-relaxed">
              Every item is inspected, sanitized, and graded before listing.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F0F4EE] text-[#3C4A3E] flex items-center justify-center border border-[#D5E1D3]">
              <Truck className="w-5 h-5 text-[#3C4A3E]" />
            </div>
            <h3 className="font-serif text-sm font-bold tracking-wide uppercase text-[#1D251E]">
              Easy Delivery
            </h3>
            <p className="text-xs text-[#5F6D61] leading-relaxed">
              Reliable, plastic-free packaging sent directly to your doorstep.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
