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
    <section id="pre-owned-section" className="py-24 sm:py-32 wood-green-surface text-[#F1EFE5] relative overflow-hidden border-b border-[#2D403D]">
      {/* Dark Forest Green Tint Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#172421]/95 via-[#233733]/88 to-[#263936]/80 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Asymmetrical Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Philosophy */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-editorial text-[#8A9C82] border border-[#8A9C82]/30 px-3 py-1 rounded-full bg-[#172421]/50 backdrop-blur-xs">
              <Recycle className="w-3.5 h-3.5 text-[#8A9C82]" />
              <span>CIRCULAR KITCHENWARE ARCHIVE</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-serif font-light text-[#F1EFE5] leading-[1.08] tracking-tight">
              FOUND AGAIN. <br />
              <span className="font-serif italic font-normal text-[#F7F5ED]">LOVED AGAIN.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#F1EFE5]/85 leading-relaxed max-w-lg font-light">
              Explore pre-owned kitchen and household pieces that still have plenty of life 
              left in them. Each item is individually inspected, ultrasonically cleaned, 
              and made ready for its next generation of daily use.
            </p>

            <div className="pt-2">
              <button
                onClick={handleExplore}
                className="px-8 py-4 bg-[#F1EFE5] hover:bg-[#F7F5ED] text-[#172421] text-xs font-semibold tracking-luxury uppercase transition-all duration-300 shadow-forest hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                <span>EXPLORE PRE-OWNED</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Metrics Strip */}
            <div className="pt-8 border-t border-[#355247] grid grid-cols-3 gap-6 text-[#F1EFE5]">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-light text-[#F1EFE5]">1,450+</p>
                <p className="text-[10px] uppercase tracking-luxury text-[#8A9C82] mt-0.5">Pieces Re-homed</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-light text-[#F1EFE5]">100%</p>
                <p className="text-[10px] uppercase tracking-luxury text-[#8A9C82] mt-0.5">Workshop Tested</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-light text-[#F1EFE5]">0%</p>
                <p className="text-[10px] uppercase tracking-luxury text-[#8A9C82] mt-0.5">Virgin Plastic</p>
              </div>
            </div>

          </div>

          {/* Right Column: Large Lifestyle Image Partially Overlapping */}
          <div className="lg:col-span-6 relative mt-8 lg:mt-0">
            <div className="relative">
              
              {/* Primary Image Frame with Green Wooden Shadow Effect */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#355247] group bg-[#172421]">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80"
                  alt="Pre-owned vintage wooden kitchen tray and utensils"
                  className="w-full h-[420px] sm:h-[500px] object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#172421]/90 via-transparent to-transparent opacity-60" />

                {/* Overlapping Detail Tag */}
                <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#1E2D2A]/95 backdrop-blur-md border border-[#355247] rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-editorial text-[#8A9C82]">
                      <Sparkles className="w-3 h-3" />
                      <span>SPOTLIGHT SELECTION</span>
                    </div>
                    <p className="font-serif text-sm sm:text-base text-[#F1EFE5] font-light">
                      Vintage Teak Serving Tray & Cast Brass Spoons
                    </p>
                  </div>
                  <span className="text-xs font-serif text-[#F7F5ED] font-light">
                    From ₹189
                  </span>
                </div>
              </div>

              {/* Offset decorative frame */}
              <div className="hidden sm:block absolute -bottom-5 -left-5 w-48 h-48 border-l border-b border-[#8A9C82]/30 pointer-events-none rounded-bl-xl" />

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
