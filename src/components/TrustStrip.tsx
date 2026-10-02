import React from 'react';
import { Recycle, IndianRupee, SearchCheck, Truck } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section className="bg-[#F1EFE5] text-[#172421] py-16 sm:py-24 border-y border-[#DED9C7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Text Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-baseline pb-14 border-b border-[#DED9C7]">
          <div className="lg:col-span-6">
            <span className="text-[10px] font-semibold tracking-editorial uppercase text-[#607A69] block mb-3">
              THE CHILLY FLAKES PURPOSE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#172421] leading-tight tracking-tight">
              GOOD THINGS <br />
              <span className="italic font-normal">DESERVE ANOTHER HOME.</span>
            </h2>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-end">
            <p className="text-base sm:text-lg text-[#2D403D] font-light leading-relaxed max-w-xl">
              Chilly Flakes brings together useful kitchen and household products that 
              are ready for everyday life — without unnecessary waste or unnecessary cost. 
              We curate seasoned kitchenware, tested daily tools, and durable homeware meant to be held, used, and cherished.
            </p>
          </div>
        </div>

        {/* 4 Minimal Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
          
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-full bg-[#E6E3D5] text-[#263936] flex items-center justify-center">
              <Recycle className="w-4 h-4 text-[#355247]" />
            </div>
            <h3 className="font-serif text-sm font-semibold tracking-luxury uppercase text-[#172421]">
              SECOND LIFE
            </h3>
            <p className="text-xs text-[#355247]/90 leading-relaxed font-light">
              Useful products deserve another home instead of a landfill.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-9 h-9 rounded-full bg-[#E6E3D5] text-[#263936] flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-[#355247]" />
            </div>
            <h3 className="font-serif text-sm font-semibold tracking-luxury uppercase text-[#172421]">
              BETTER VALUE
            </h3>
            <p className="text-xs text-[#355247]/90 leading-relaxed font-light">
              Quality kitchen essentials at honest, uninflated prices.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-9 h-9 rounded-full bg-[#E6E3D5] text-[#263936] flex items-center justify-center">
              <SearchCheck className="w-4 h-4 text-[#355247]" />
            </div>
            <h3 className="font-serif text-sm font-semibold tracking-luxury uppercase text-[#172421]">
              CAREFULLY CHECKED
            </h3>
            <p className="text-xs text-[#355247]/90 leading-relaxed font-light">
              Every item is inspected, sanitized, and graded before listing.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-9 h-9 rounded-full bg-[#E6E3D5] text-[#263936] flex items-center justify-center">
              <Truck className="w-4 h-4 text-[#355247]" />
            </div>
            <h3 className="font-serif text-sm font-semibold tracking-luxury uppercase text-[#172421]">
              EASY DELIVERY
            </h3>
            <p className="text-xs text-[#355247]/90 leading-relaxed font-light">
              Reliable, plastic-free packaging sent directly to your doorstep.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
