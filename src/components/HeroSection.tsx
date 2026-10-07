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
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden bg-[#F4F6F2] border-b border-[#E5EAE2]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Asymmetric Editorial Typography */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 sm:space-y-8 z-20">
            
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-[#3C4A3E] border border-[#C4D3C2] bg-[#EAF0E6] px-3.5 py-1 rounded-full">
              <span>CHILLY FLAKES / EVERYDAY LIVING</span>
            </div>

            {/* Large Editorial Serif Display Heading */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif font-bold text-[#1D251E] leading-[1.08] tracking-tight">
              Everyday Things. <br />
              <span className="font-serif italic font-normal text-[#3C4A3E]">A Second Life.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#5F6D61] leading-relaxed max-w-lg font-normal">
              Discover useful kitchen and household essentials — new, pre-owned and 
              carefully selected for their next home. Crafted from seasoned wood, 
              enduring stoneware, and lifelong stainless steel.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollTo('shop-section', 'All')}
                className="px-8 py-3.5 bg-[#3C4A3E] hover:bg-[#2C372D] text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 rounded-full shadow-xs hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollTo('pre-owned-section')}
                className="px-7 py-3.5 border border-[#3C4A3E] hover:bg-[#3C4A3E] hover:text-white text-[#3C4A3E] text-xs font-semibold tracking-wider uppercase transition-all duration-300 rounded-full flex items-center gap-2"
              >
                <Recycle className="w-3.5 h-3.5" />
                <span>Explore Pre-Owned</span>
              </button>
            </div>

            {/* Small Natural Detail */}
            <div className="pt-6 border-t border-[#DFE6DD] flex items-center gap-6 text-[11px] text-[#5F6D61] font-medium uppercase tracking-wider">
              <span>Hand-Inspected Pieces</span>
              <span className="text-[#3C4A3E]">•</span>
              <span>Cleaned & Sanitized</span>
              <span className="text-[#3C4A3E]">•</span>
              <span>Zero Plastic Waste</span>
            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 xl:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="relative rounded-3xl overflow-hidden shadow-card border border-[#DEE5DC] group bg-white">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85"
                  alt="Wooden kitchen table with utensils, bowls, and soft natural sunlight"
                  className="w-full h-[460px] sm:h-[520px] object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                />

                {/* Overlapping Editorial Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 bg-white/95 backdrop-blur-md border border-[#E5EAE2] text-[#1D251E] rounded-2xl flex items-center justify-between shadow-soft">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#3C4A3E]">AUTUMN COLLECTION</p>
                    <p className="font-serif text-sm font-bold text-[#1D251E]">Seasoned Teak & Earthen Stoneware</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#3C4A3E] bg-[#EAF0E6] px-2 py-0.5 rounded-full">№ 024</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
