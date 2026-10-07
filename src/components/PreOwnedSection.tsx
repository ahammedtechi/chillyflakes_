import React from 'react';
import { ArrowRight, Recycle, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PreOwnedSection: React.FC = () => {
  const { setSelectedCategory } = useStore();

  const handleExplore = () => {
    setSelectedCategory('PRE-OWNED FINDS');
    const shopEl = document.getElementById('shop-section');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pre-owned-section" className="py-20 sm:py-28 bg-[#F4F6F2] text-[#1D251E] relative overflow-hidden border-b border-[#E5EAE2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Asymmetrical Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Philosophy */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#3C4A3E] border border-[#C4D3C2] px-3.5 py-1 rounded-full bg-[#EAF0E6]">
              <Recycle className="w-3.5 h-3.5 text-[#3C4A3E]" />
              <span className="font-semibold">CIRCULAR KITCHENWARE ARCHIVE</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-serif font-bold text-[#1D251E] leading-[1.08] tracking-tight">
              Found Again. <br />
              <span className="font-serif italic font-normal text-[#3C4A3E]">Loved Again.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#5F6D61] leading-relaxed max-w-lg font-normal">
              Explore pre-owned kitchen and household pieces that still have plenty of life 
              left in them. Each item is individually inspected, ultrasonically cleaned, 
              and made ready for its next generation of daily use.
            </p>

            <div className="pt-2">
              <button
                onClick={handleExplore}
                className="px-8 py-3.5 bg-[#3C4A3E] hover:bg-[#2C372D] text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 rounded-full shadow-xs hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                <span>Explore Pre-Owned</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Metrics Strip */}
            <div className="pt-8 border-t border-[#DFE6DD] grid grid-cols-3 gap-6 text-[#1D251E]">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#3C4A3E]">1,450+</p>
                <p className="text-[10px] uppercase tracking-wider text-[#7C8B7E] mt-0.5">Pieces Re-homed</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#3C4A3E]">100%</p>
                <p className="text-[10px] uppercase tracking-wider text-[#7C8B7E] mt-0.5">Workshop Tested</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#3C4A3E]">0%</p>
                <p className="text-[10px] uppercase tracking-wider text-[#7C8B7E] mt-0.5">Virgin Plastic</p>
              </div>
            </div>

          </div>

          {/* Right Column: Large Lifestyle Image */}
          <div className="lg:col-span-6 relative mt-8 lg:mt-0">
            <div className="relative">
              
              <div className="relative rounded-3xl overflow-hidden shadow-card border border-[#DEE5DC] group bg-white">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80"
                  alt="Pre-owned vintage wooden kitchen tray and utensils"
                  className="w-full h-[420px] sm:h-[480px] object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                />

                {/* Overlapping Detail Tag */}
                <div className="absolute bottom-6 left-6 right-6 p-4 sm:p-5 bg-white/95 backdrop-blur-md border border-[#E5EAE2] rounded-2xl flex items-center justify-between shadow-soft">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#3C4A3E] font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>SPOTLIGHT SELECTION</span>
                    </div>
                    <p className="font-serif text-sm sm:text-base text-[#1D251E] font-bold">
                      Vintage Teak Serving Tray & Cast Brass Spoons
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#3C4A3E] bg-[#EAF0E6] px-2.5 py-1 rounded-full">
                    From ₹189
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
