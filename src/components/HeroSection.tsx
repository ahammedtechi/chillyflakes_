import React from 'react';
import { ArrowRight, Recycle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroSection: React.FC = () => {
  const { setSelectedCategory } = useStore();

  const scrollTo = (id: string, categoryFilter?: string) => {
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[660px] lg:min-h-[760px] flex items-center overflow-hidden wood-green-surface border-b border-[#2D403D]">
      {/* Subtle Dark Desaturated Forest Overlay over the Green Wood Surface */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#172421]/92 via-[#263936]/85 to-[#2D403D]/75 pointer-events-none" />

      {/* Decorative vertical editorial line */}
      <div className="hidden xl:block absolute left-16 top-0 bottom-0 w-px bg-[#F1EFE5]/10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Asymmetric Editorial Typography */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 sm:space-y-8 z-20">
            
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-editorial uppercase text-[#8A9C82] border-b border-[#8A9C82]/30 pb-1">
              <span>CHILLY FLAKES / EVERYDAY LIVING</span>
            </div>

            {/* Large Editorial Serif Display Heading */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif font-light text-[#F1EFE5] leading-[1.08] tracking-tight">
              EVERYDAY <br />
              <span className="font-serif italic font-normal text-[#F7F5ED]">THINGS.</span> <br />
              A SECOND <br />
              LIFE.
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-[#F1EFE5]/85 leading-relaxed max-w-lg font-light tracking-wide">
              Discover useful kitchen and household essentials — new, pre-owned and 
              carefully selected for their next home. Crafted from seasoned wood, 
              enduring stoneware, and lifelong stainless steel.
            </p>

            {/* Minimal Luxury Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollTo('shop-section', 'All')}
                className="px-8 py-3.5 bg-[#F1EFE5] hover:bg-[#F7F5ED] text-[#172421] text-xs font-semibold tracking-luxury uppercase transition-all duration-300 shadow-forest hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollTo('pre-owned-section')}
                className="px-7 py-3.5 border border-[#F1EFE5]/40 hover:border-[#F1EFE5] text-[#F1EFE5] text-xs font-medium tracking-luxury uppercase transition-all duration-300 hover:bg-[#F1EFE5]/5 flex items-center gap-2"
              >
                <Recycle className="w-3.5 h-3.5 text-[#8A9C82]" />
                <span>EXPLORE PRE-OWNED</span>
              </button>
            </div>

            {/* Small Natural Detail */}
            <div className="pt-6 border-t border-[#F1EFE5]/10 flex items-center gap-6 text-[11px] text-[#A5B59E] uppercase tracking-wider">
              <span>Hand-Inspected Pieces</span>
              <span className="text-[#355247]">•</span>
              <span>Cleaned & Sanitized</span>
              <span className="text-[#355247]">•</span>
              <span>Zero Plastic Waste</span>
            </div>

          </div>

          {/* Right Column: Large Vertical Image overlapping typography */}
          <div className="lg:col-span-5 xl:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Green Wooden Framing & Depth Shadow */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#355247]/60 group">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85"
                  alt="Wooden kitchen table with utensils, bowls, and soft natural sunlight"
                  className="w-full h-[460px] sm:h-[540px] object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                />
                
                {/* Subtle dark green vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#172421]/80 via-transparent to-transparent opacity-60" />

                {/* Overlapping Editorial Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 bg-[#1E2D2A]/90 backdrop-blur-md border border-[#355247] text-[#F1EFE5] rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-editorial text-[#8A9C82]">AUTUMN RECLAIMED COLLECTION</p>
                    <p className="font-serif text-sm font-light text-[#F1EFE5]">Seasoned Teak & Earthen Stoneware</p>
                  </div>
                  <span className="font-mono text-xs text-[#8A9C82]">№ 024</span>
                </div>
              </div>

              {/* Offset decorative green wood accent border */}
              <div className="hidden sm:block absolute -top-4 -right-4 w-full h-full border border-[#8A9C82]/20 rounded-2xl -z-10 pointer-events-none" />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
